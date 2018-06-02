import React from 'react';
import {compose, mapProps} from 'recompose';

import InputOnChangedComponent from './InputOnChangedComponent';


export default compose(
  mapProps((ownerProps) => {
    let newProps = ownerProps;

    if(ownerProps.restrictChars) {
      let {newProps, restrictChars} = ownerProps;

      newProps.onKeyPress = (e) => {
        const char = String.fromCharCode(e.charCode);

        if(char && !char.match(restrictChars)) {
          e.preventDefault();

          return;
        }

        if(ownerProps.onKeyPress) {
          ownerProps.onKeyPress(e);
        }
      }

      newProps.onInput = (e) => {
        const field = e.target;
        let str = field.value;
        const distFromEnd = str.length - field.selectionEnd;

        str = str.split('').reduce((acc, char) => {
          return char.match(restrictChars) ? acc + char : acc;
        }, '');

        if(str != field.value) {
          field.value = str;

          field.selectionStart = field.selectionEnd = str.length - distFromEnd;
        }

        ownerProps.onInput && ownerProps.onInput(e);
      }
    }

    return newProps;
  }),
  InputOnChangedComponent()
);
