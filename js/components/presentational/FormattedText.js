import React from 'react';
import PropTypes from 'prop-types';

import {isReactElement} from '../../helpers/ExtendedPropTypes';


import {parseBBCode} from '../../helpers/BBCode';
import {elementToString} from '../../helpers/ReactHelpers';


//This component is Pure

export default function FormattedText({id, params, strings, fallback = null}, context) {
  let str = strings[id];
  let isBBCode = false;

  if(typeof(str) !== 'string') {
    if(str === undefined || !('originalStr' in str)) {
      return fallback || id;//this lang entry was not found
    }

    str = str.originalStr;
    isBBCode = true;
  }

  //actually perform the string replacing
  const parsedStr = formatString2(str, params, context, isBBCode);

  return parsedStr;
}

//const paramTypes = PropTypes.oneOfType([PropTypes.string, isReactElement, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]);

FormattedText.propTypes = {
  id: PropTypes.string.isRequired,
  params: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  strings: PropTypes.object.isRequired,
  fallback: PropTypes.string
};

FormattedText.contextTypes = {
  store: PropTypes.object
}


export function formatString2(str, params, context, doParseBBCode) {
  if(!params) {
    return str;
  }

  const parts = [];

  while(str.length > 0) {
    let index = str.indexOf('{');

    while(str.charAt(index + 1) === '{') {
      index = str.indexOf('{', index+2);//ignore escaped {'s
    }

    if(index === -1) {
      parts.push(str);
      str = '';
    } else {
      let endIndex = str.indexOf('}', index+1);
      let paramName = str.substr(index+1, endIndex - (index+1));

      if(index !== 0) {
        //add the 'pre string' to the parts
        let preStr = str.substr( 0, index);

        parts.push(doParseBBCode ? parseBBCode(preStr) : preStr);
      }

      let param = params[paramName];

      if(doParseBBCode && typeof(param) === 'string') {
        param = parseBBCode(param);
      } else if(React.isValidElement(param) && !param.key) {
        param = React.cloneElement(param, {key: parts.length});
      } else if(param instanceof Array) {
        param.forEach((item, index) => {
          if(index > 0) {
            parts.push(', ');
          }

          parts.push(item);
        });

        param = null;
        //param = param.join(', ');//TODO make this language code specific? Allow object/elements in teh array
      }

      if(param) {
        parts.push(param);
      }

      str = str.substr(endIndex+1);
    }
  }

  return parts.length === 1 ? parts[0] : parts;
}


export function formatString(str, params, context) {
  if(!params) {
    return str;
  }

  return str.replace(/\{([^}]+)\}/g, (capture1, subCapture) => {
    if(params[subCapture] instanceof Array) {
      return params[subCapture].join(', ');//TODO make this language code specific?
    }

    return elementToString(params[subCapture], context);
  });
}
