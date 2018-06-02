import React from 'react';
import bbcodeParser, {Tag} from 'bbcode-to-react';


export function parseBBCode(str) {
  if(str == null) {
    return null;
  }

  let parsedStr = bbcodeParser.toReact(str);

  if((parsedStr instanceof Array) && parsedStr.length == 1 && typeof(parsedStr[0]) == 'string') {
    return parsedStr[0];
  }

  parsedStr.originalStr = str;

  return parsedStr;
}


//extend BBCode
class SpanTag extends Tag {
  toReact() {
    return (
      <span {...this.params}>{this.getComponents()}</span>
    );
  }
}

class DLTag extends Tag {
  toReact() {
    return (
      <dl {...this.params}>{this.getComponents()}</dl>
    );
  }
}

class DTTag extends Tag {
  toReact() {
    return (
      <dt {...this.params}>{this.getComponents()}</dt>
    );
  }
}

class DDTag extends Tag {
  toReact() {
    return (
      <dd {...this.params}>{this.getComponents()}</dd>
    );
  }
}

class SpaceTag extends Tag {
  toReact() {
    return <span>&nbsp;</span>
  }
}

class PTag extends Tag {
  toReact() {
    return <p {...this.params}>{this.getComponents()}</p>
  }
}

class ULTag extends Tag {
  toReact() {
    return <ul {...this.params}>{this.getComponents()}</ul>
  }
}

class OLTag extends Tag {
  toReact() {
    return <ol {...this.params}>{this.getComponents()}</ol>
  }
}

class LITag extends Tag {
  toReact() {
    return <li {...this.params}>{this.getComponents()}</li>
  }
}

bbcodeParser.registerTag('span', SpanTag);
bbcodeParser.registerTag('dl', DLTag);
bbcodeParser.registerTag('dt', DTTag);
bbcodeParser.registerTag('dd', DDTag);
bbcodeParser.registerTag('space', SpaceTag);
bbcodeParser.registerTag('p', PTag);
bbcodeParser.registerTag('ul', ULTag);
bbcodeParser.registerTag('ol', OLTag);
bbcodeParser.registerTag('li', LITag);
