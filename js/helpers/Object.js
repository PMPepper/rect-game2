//object functions
export function keyOf(obj, prop) {
  for(let key in obj) {
    if(obj.hasOwnProperty(key) && obj[key] === prop) {
      return key;
    }
  }

  return null;
}

export function resolveObjPath(obj, path) {
  path = path
    .replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '');          // strip a leading dot

  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj);
}

export function objNumKeys(obj) {
  if(!obj) {
    return 0;
  }

  let count = 0;

  for( let key in obj) {
    if(obj.hasOwnProperty(key)) {
      count++;
    }
  }

  return count;
}

export function isObjEmpty(obj, enforceExistanceCheck = false) {
  if(!obj) {
    if(enforceExistanceCheck) {
      throw new Error('no object supplied');
    }

    return true;
  }

  for( let key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

export function cloneObjectWithoutKeys(object, keys) {
  if(!object) {
    return null;
  }

  return Object.keys(object).reduce((result, key) => {
    if(keys.indexOf(key) == -1) {
       result[key] = object[key];
    }
    return result;
  }, {});
}

export function objectSelectKeysWithArray(object, keys) {
  return keys.reduce((outputObj, key) => {
    if(object.hasOwnProperty(key)) {
      outputObj[key] = object[key];
    }

    return outputObj;
  }, {});
}

export function objectsHaveSameProps( obj1, obj2 ) {
    var obj1Props = Object.keys( obj1 ),
        obj2Props = Object.keys( obj2 );

    if ( obj1Props.length == obj2Props.length ) {
        return obj1Props.every( function( prop ) {
          return obj2Props.indexOf( prop ) >= 0;
        });
    }

    return false;
}

//calback(value, key, object)
export function mapObj(object, callback) {
  return Object.keys(object).reduce((mappedObj, key) => {
    mappedObj[key] = callback(object[key], key, object);

    return mappedObj;
  }, {});
}

export function mapObjToArray(object, callback) {
  return Object.keys(object).reduce((mappedArr, key) => {
    mappedArr.push(callback(object[key], key, object));

    return mappedArr;
  }, []);
}

//Filter func: (key, value, obj)
export function objFilter(obj, filterFunc) {
  const filteredObj = {};

  if(obj) {
    Object.keys(obj).forEach((key) => {
      if(filterFunc(key, obj[key], obj)) {
        filteredObj[key] = obj[key];
      }
    });
  }

  return filteredObj;
}

export function objForEach(obj, callback) {
  for(let i = 0, values = Object.values(obj); i < values.length; i++) {
    callback(values[i]);
  }
}
