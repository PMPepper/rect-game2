const gulp = require('gulp');
const gutil = require('gulp-util')
const path = require('path');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
require('script-loader');
require('json-loader');
const sass = require('gulp-sass');
const nunjucks = require('gulp-nunjucks');
const filter = require('gulp-filter');
const data = require('gulp-data');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const directoryMap = require("gulp-directory-map");
const del = require('del');
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const debug = require('gulp-debug');
const fs = require('fs-extra');
const stripDebug = require('gulp-strip-debug');
const exec  = require('exec-chainable');
const gulpWatch = require('gulp-watch');


const watch = gulpWatch;//gulp.watch;

const config = {
  devOutputPath:'develop',
  buildOutputPath:'build',
  autoprefixer: {
    browsers: require('./browsers')
  },
  sass: {
    includePaths: ['node_modules']
  },
  cssnano: {
    dev: {},
    build: {}
  }
};

const npmConfig = require('./package.json');


config.css = {
  devOutputPath: config.devOutputPath + '/css',
  buildOutputPath: config.buildOutputPath + '/css',
  watch: ['scss/**/*.+(css|scss)'],
  src: 'scss/**/*.+(css|scss)',
  devSourcemaps: {
    enabled: true
  },
  buildSourcemaps: {
    enabled: false
  }
};

config.html = {
  devOutputPath: config.devOutputPath + '/html',
  buildOutputPath: config.buildOutputPath + '/html',
  watch: ['html/**/+(*.json|*.+(html|nunjucks))'],
  src: 'html/**/+(*.html|config.json)',
  nunjucks: {
    enabled: true,
    dataFile: './html/data'
  },
  devSourcemaps: {
    enabled: true
  },
  buildSourcemaps: {
    enabled: false
  }
};

config.images = {
  devOutputPath: config.devOutputPath + '/images',
  buildOutputPath: config.buildOutputPath + '/images',
  watch: ['images/**/*.+(jpg|jpeg|png|gif|svg)'],
  src: 'images/**/*.+(jpg|jpeg|png|gif|svg)',
  mapOptions: {
    filename: 'images.json',
    path: 'images'
  }
};

config.js = {
  devOutputPath: config.devOutputPath + '/js',
  buildOutputPath: config.buildOutputPath + '/js',
  watch: ['js/**/*.+(js|json|jsx)', config.images.mapOptions.path+'/'+config.images.mapOptions.filename],
  entry: npmConfig.main,//used by webpack, instead of src
  devSourcemaps: {
    enabled: true
  },
  buildSourcemaps: {
    enabled: false //TODO make this work (need to use filter before uglify?)
  }
};

config.notify = {
  js: 'Error: <%= error.message %>',
  css: 'Error: <%= error.message %>'
};

config.plumber = {
  js: {
    errorHandler: notify.onError(config.notify.js)
  },
  css: {
    errorHandler: notify.onError(config.notify.css)
  }
};

config.uglify = {
  build: {}
};

config.browserSync = {
    server: {
        baseDir: "./"+config.devOutputPath
    },
    startPath: 'html/',
    ghostMode:false,
    notify:false,
    reloadDelay: 200,
    reloadDebounce: 500
};

config.browserSyncBuild = {
    server: {
        baseDir: "./"+config.buildOutputPath
    },
    startPath: 'html/',
    ghostMode:false,
    notify:false,
    reloadDelay: 200,
    reloadDebounce: 500
};

//Webpack
const baseWebpackConfig = {
  module: {
    loaders: [
      {
        test: /.*.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', {
            'targets': {
              browsers: require('./browsers')
              }
            }], 'react'
          ],
          plugins: ['transform-runtime', 'transform-object-rest-spread', 'transform-class-properties']
        }
      }
    ]
  }
};

const baseWebpackDevConfig = {
  ...baseWebpackConfig,
    devtool: 'source-map',
};

const baseWebpackBuildConfig = {
  ...baseWebpackConfig,
  devtool: (config.js.buildSourcemaps.enabled ? 'source-map' : false),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

config.webpack = {
  dev: {
      ...baseWebpackDevConfig,
      output: {
        path: __dirname + "/"+config.js.devOutputPath,
        filename: "scripts.js"
      }
    },
  build: {
    ...baseWebpackBuildConfig,
    output: {
        path: __dirname + "/"+config.js.buildOutputPath,
        filename: "scripts.js"
    }
  }
};

config.webpackWorker = {
  dev: {
      ...baseWebpackDevConfig,
      output: {
        path: __dirname + "/"+config.js.devOutputPath,
        filename: "worker.js"
      }
    },
  build: {
    ...baseWebpackBuildConfig,
    output: {
        path: __dirname + "/"+config.js.buildOutputPath,
        filename: "worker.js"
    }
  }
};


config.copy = {
  dev: {
    fonts: config.devOutputPath+'/fonts'
  },
  build: {
    fonts: config.buildOutputPath+'/fonts'
  }
}

config.copy.watch = (() => {
  const allKeys = {};

  const mergeFunc = (allKeys, key) => {
    allKeys[key] = key;
    return allKeys;
  };

  Object.keys(config.copy.dev).reduce(mergeFunc, allKeys);
  Object.keys(config.copy.build).reduce(mergeFunc, allKeys);

  return Object.keys(allKeys).map((src) => {
    return src+'/**/*';
  });
})();

var isBrowserSync = false;

//General functions
function gulpJsSrc() {
  return gulp.src(config.js.entry);
}

function gulpCssSrc() {
  return gulp.src(config.css.src);
}

function gulpHtmlSrc() {
  return gulp.src(config.html.src);
}

function gulpImagesSrc() {
  return gulp.src(config.images.src);
}

//Define tasks

//-JS tasks
gulp.task('js-dev', ['js-clean-dev', 'js-worker-dev'], () => {
  return gulpJsSrc()
    .pipe(plumber(config.plumber.js))
    .pipe(config.js.devSourcemaps.enabled ? sourcemaps.init(config.js.devSourcemaps.options) : filter(['**/*']))
    .pipe(webpackStream((config.webpack.dev instanceof Array) ? {config: config.webpack.dev} : config.webpack.dev, webpack))
    .pipe(debug())
    .pipe(config.js.devSourcemaps.enabled ? sourcemaps.write(config.js.devSourcemaps.path, config.js.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.js.devOutputPath+'/'));
});

gulp.task('js-worker-dev', () => {
  return gulp.src('js/worker.js')
    .pipe(plumber(config.plumber.js))
    .pipe(config.js.devSourcemaps.enabled ? sourcemaps.init(config.js.devSourcemaps.options) : filter(['**/*']))
    .pipe(webpackStream((config.webpackWorker.dev instanceof Array) ? {config: config.webpackWorker.dev} : config.webpackWorker.dev, webpack))
    .pipe(debug())
    .pipe(config.js.devSourcemaps.enabled ? sourcemaps.write(config.js.devSourcemaps.path, config.js.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.js.devOutputPath+'/'));
});

gulp.task('js-watch', ['js-dev'], () => {
  return watch(config.js.watch, () => {
    runSequence('js-dev', 'dev-server-refresh');
  });
});

gulp.task('js-build', ['js-clean-build', 'js-worker-build'], function() {
  return gulpJsSrc()
    .pipe(plumber(config.plumber.js))
    //.pipe(config.js.devSourcemaps.enabled ? sourcemaps.init(config.js.devSourcemaps.options) : filter(['**/*']))
    .pipe(webpackStream((config.webpack.build instanceof Array) ? {config: config.webpack.build} : config.webpack.build, webpack))
    //.pipe(config.js.devSourcemaps.enabled ? sourcemaps.write(config.js.devSourcemaps.path, config.js.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(uglify())
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(stripDebug())
    .pipe(gulp.dest(config.js.buildOutputPath+'/'));
});

gulp.task('js-worker-build', ['js-clean-build'], function() {
  return gulp.src('js/worker.js')
    .pipe(plumber(config.plumber.js))
    //.pipe(config.js.devSourcemaps.enabled ? sourcemaps.init(config.js.devSourcemaps.options) : filter(['**/*']))
    .pipe(webpackStream((config.webpackWorker.build instanceof Array) ? {config: config.webpackWorker.build} : config.webpackWorker.build, webpack))
    //.pipe(config.js.devSourcemaps.enabled ? sourcemaps.write(config.js.devSourcemaps.path, config.js.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(uglify())
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(stripDebug())
    .pipe(gulp.dest(config.js.buildOutputPath+'/'));
});

gulp.task('js-clean-dev', (done) => {
  del([config.js.devOutputPath+'/*.*']).then(() => {done()});
});

gulp.task('js-clean-build', (done) => {
  del([config.js.buildOutputPath+'/*.*'], {force: true}).then(() => {done()});
});

//-CSS tasks
function cssDev() {
  return gulpCssSrc()
    .pipe(plumber(config.plumber.css))
    .pipe(config.css.devSourcemaps.enabled ? sourcemaps.init(config.css.devSourcemaps.options) : filter(['**/*']))
    .pipe(sass(config.sass))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(config.css.devSourcemaps.enabled ? sourcemaps.write(config.css.devSourcemaps.path, config.css.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.css.devOutputPath+'/'));
}

gulp.task('css-dev', ['css-clean-dev'], function() {
  return cssDev();
});

gulp.task('css-watch', ['css-dev'], () => {
  return watch(config.css.watch, () => {
    return isBrowserSync ? cssDev().pipe(browserSync.stream()) : cssDev();
  });
});

gulp.task('css-build', ['css-clean-build'], function() {
  return gulpCssSrc()
    .pipe(plumber(config.plumber.css))
    .pipe(config.css.buildSourcemaps.enabled ? sourcemaps.init(config.css.buildSourcemaps.options) : filter(['**/*']))
    .pipe(sass(config.sass))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(cssnano(config.cssnano.build))
    .pipe(config.css.buildSourcemaps.enabled ? sourcemaps.write(config.css.buildSourcemaps.path, config.css.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.css.buildOutputPath+'/'));
});

gulp.task('css-clean-dev', (done) => {
  del([config.css.devOutputPath+'/*.*']).then(() => {done()});
});

gulp.task('css-clean-build', (done) => {
  del([config.css.buildOutputPath+'/*.*'], {force: true}).then(() => {done()});
});


//-HTML tasks
function html() {
  var pipe = gulpHtmlSrc();

  if(config.html.nunjucks.enabled) {
    pipe = pipe
      .pipe(data(() => {
        //need to delete cache entry so that changes actually get applied
        delete require.cache[require.resolve(config.html.nunjucks.dataFile)]
        return require(config.html.nunjucks.dataFile);
      }))
      .pipe(nunjucks.compile(config.html.nunjucks));
  }

  return pipe;
}

gulp.task('html-dev', ['html-clean-dev'], function() {
  return html().pipe(gulp.dest(config.html.devOutputPath+'/'));
});

gulp.task('html-watch', ['html-dev'], () => {
  return watch(config.html.watch, () => {
    runSequence('html-dev', 'dev-server-refresh');
  });
});

gulp.task('html-build', ['html-clean-build'], () => {
  return html().pipe(gulp.dest(config.html.buildOutputPath+'/'));
});

gulp.task('html-clean-dev', (done) => {
  del([config.html.devOutputPath]).then(() => {done()});
});

gulp.task('html-clean-build', (done) => {
  del([config.html.buildOutputPath]).then(() => {done()});
});

//TODO image tasks
gulp.task('images-dev', ['images-clean-dev', 'images-map'], () => {
  return gulpImagesSrc()
    .pipe(gulp.dest(config.images.devOutputPath+'/'))
});

gulp.task('images-watch', () => {
  return watch(config.images.watch, () => {
    runSequence('images-dev', 'dev-server-refresh');
  });
});

gulp.task('images-build', ['images-clean-build', 'images-map'], () => {
  return gulpImagesSrc()
    .pipe(gulp.dest(config.images.buildOutputPath+'/'));
});

gulp.task('images-clean-dev', (done) => {
  del([config.images.devOutputPath]+'/*.*').then(() => {done()});
});

gulp.task('images-clean-build', (done) => {
  del([config.images.buildOutputPath]+'/*.*').then(() => {done()});
});

gulp.task('images-map', (cb) => {
  //del.sync([config.images.mapOptions.path+'/'+config.images.mapOptions.filename]);

  /*return gulpImagesSrc()
    .pipe(directoryMap(config.images.mapOptions))
    .pipe(gulp.dest(config.images.mapOptions.path+'/'));*/

    cb();
});

//-copy tasks


gulp.task('copy-dev', ['copy-clean-dev'], (done) => {
  let promises = Object.keys(config.copy.dev).map((src) => {
    let dest = config.copy.dev[src];

    return fs.copy(src, dest);
  });

  Promise.all(promises).then((values) => {
    done();
  });
});

gulp.task('copy-build', ['copy-clean-build'], (done) => {
  let promises = Object.keys(config.copy.build).map((src) => {
    let dest = config.copy.build[src];

    return fs.copy(src, dest);
  });

  Promise.all(promises).then((values) => {
    done();
  });
});

gulp.task('copy-watch', ['copy-dev'], () => {
  return watch(config.copy.watch, () => {
    runSequence('copy-dev', 'dev-server-refresh');
  });
});

gulp.task('copy-clean-dev', (done) => {
  const delDirs = Object.values(config.copy.dev).map((dir) => {
    return dir+'/**/*';
  });

  del(delDirs).then(() => {done()});
});



gulp.task('copy-clean-build', (done) => {
  const delDirs = Object.values(config.copy.build).map((dir) => {
    return dir+'/*.*';
  });

  del(delDirs).then(() => {done()});
});

//General tasks
const devTasks =    ['images-dev', ['js-dev', 'css-dev', 'html-dev', 'copy-dev']];
const buildTasks =  ['images-build', ['js-build', 'css-build', 'copy-build'], 'build-finished'];
const watchTasks =  [['images-watch','js-watch', 'css-watch', 'html-watch', 'copy-watch']];

//A one-off dev build
gulp.task('dev', (done) => {
  runSequence.apply(null, devTasks.concat(done));
});

//run a dev build, then watch for future changes & continue dev building
gulp.task('watch', () => {
  runSequence.apply(null, watchTasks);
});

//like watch, but also runs a development web server with browserSync
gulp.task('dev-server', ['dev'], () => {
  browserSync.init(config.browserSync);
  isBrowserSync = true;
  runSequence('watch');
});

//Needed for internal use only
gulp.task('dev-server-refresh', (done) => {
  if(isBrowserSync) {
    browserSync.reload();
  }
  done();
});

//A one-off full build
gulp.task('build', (done) => {
  runSequence.apply(null, buildTasks.concat(done));
});

gulp.task('build-server', ['dev'], () => {
  browserSync.init(config.browserSyncBuild);
  isBrowserSync = true;
  runSequence.apply(null, buildTasks);
});

//Mark the build folder as hidden - this is to prevent TFS from seeing the
//build folder as having 'changed' and wanting to check it in.
gulp.task('build-finished', () => {
  return exec(`attrib +h ${config.buildOutputPath}`)
});
