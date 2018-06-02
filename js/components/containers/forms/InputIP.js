import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';
import WithStateHandlersComponent from '../../highOrderComponents/WithStateHandlersComponent';

//presentational
import InputText from '../../presentational/forms/InputText';

//helpers
import {requiredTest} from '../../../logic/FormValidation';
import {isIPAddress} from '../../../helpers/Helpers';

//vars
import {inputModifiers} from '../../../vars/FormModifiers';



//Consts
const NOT_INVALID = 'notInvalid';
const VALID = 'valid';
const INVALID = 'invalid';

//backspace, delete, tab, escape, enter and .
//export const specialCharKeycodes = [46, 8, 9, 27, 13, 110, 190];
export const maxLength = 15;//ipv4
export const maxLengthIPv6 = 47+4;//allow routing chars

//Helpers methods

//Will only return true is definitely right. If in doubt, return false
//Not rigourous, use only for internal validation of limited strings
export function isIPv6(str) {
  return !!str.match(/[:a-fA-F/]+/);
}

//Will only return true is definitely right. If in doubt, return false
//Not rigourous, use only for internal validation of limited strings
export function isIPv4(str) {
  return !!str.match(/\./);
}

export function stripInvalidCharacters(str) {
  return str
    .replace(/[^.0-9]/g, '')//strips everything except numbers and fullstops
    .substr(0, maxLength);//enforce length limit
}

export function stripInvalidCharactersAllowIPv6(str) {
  return str
    .replace(/[^.:a-fA-F0-9/]/g, '')//strips everything except numbers and fullstops
    .substr(0, maxLengthIPv6);//enforce length limit
}

export function checkIsValid(str, allowIPv6) {
  //allow IPv6
  if(allowIPv6 && (isIPv6(str) || !isIPv4(str))) {
    if(str.match(/::[^:]*::/) || str.match(/:::/)) {
      return false;
    }

    let hasCollapsedGroup = false;
    let isEmpty = true;
    let routingParts = str.split('/');
    let hasRouting = routingParts.length > 1;

    str = routingParts[0];

    if(hasRouting) {
      if(routingParts.length > 2) {
        return false;
      }

      let netNum = +routingParts[1];

      if(!Number.isInteger(Math.log2(netNum))) {
        return false;
      }
    }

    const parts = str.split(':');

    //IP address is too long
    if(parts.length > 8) {
      return false;
    }

    //check if the hex values are valid
    for(let i = 0; i < parts.length; i++) {
      if(parts[i].length > 4) {
        return false;
      } else if(parts[i].length === 0) {
        hasCollapsedGroup = true;
      } else {
        isEmpty = false;
      }
    }

    const isAddressLongEnough = hasCollapsedGroup || parts.length == 8;

    //has routing and isn't long enough OR string starts with single colon
    if((hasRouting && !isAddressLongEnough) || str.match(/^:[^:]/)) {
      return false;
    }

    //If it's empty, or not long enough, or ends with a single colon
    if(isEmpty || !isAddressLongEnough || str.match(/[^:]:$/)) {
      return null;
    }

    //there's more I could validate, like is the :: part the leftmost one?
    //but is not essential.

    return true;
  }

  if(str.match(/\.\./)) {
    return false;
  }

  const parts = str.split('.');

  if(parts.length > 4) {
    return false;
  }

  for(let i = 0; i < parts.length; i++) {
    if(+parts[i] >= 255) {
      return false;
    }
  }

  //if you get here, it might be valid
  if(!isIPAddress(str)) {
    return null;
  }

  return true;
}

//the component
const Component = compose(
  WithStateHandlersComponent(
    {
      valid: NOT_INVALID
    },
    {
      checkIsValid: ({setIsValid, setIsInvalid, setIsNotInvalid}) => (str, allowIPv6) => {
        const isValid = checkIsValid(str, allowIPv6);

        if(isValid === true) {
          return {valid: VALID}
        } else if(isValid === false) {
          return {valid: INVALID}
        }

        return {valid: NOT_INVALID}//Doesn't mean it's valid - just that it's not definitely invalid
      }
    },
    {
      withPropsOnChange: [
        ['value', 'allowIPv6'],
        (props) => {//{value, allowIPv6, checkIsValid}
          props.checkIsValid(props.value, props.allowIPv6);
        }
      ],
      mapProps: ({allowIPv6, onInput, onKeyPress, setValue, checkIsValid, ...rest}) => {
        return {
          ...rest,
          allowIPv6,
          minLength: allowIPv6 ? 3 : 7,
          autoComplete: 'on',
          autoCorrect: 'off',
          autoCapitalize: 'off',
          spellCheck: 'false',
          inputMode: 'numeric',
          onInput: e => {//This is to prevent invalid data from being pasted in
            const input = e.target;
            const stripped = allowIPv6 ?
              stripInvalidCharactersAllowIPv6(input.value)
              :
              stripInvalidCharacters(input.value);

            //Only change value if chars need to be stripped.
            if(stripped != input.value) {
              //record relative caret position
              let caretDistFromEnd = input.value.length - input.selectionStart;

              //replace string with stripped string
              input.value = stripped;

              //reset caret position
              input.selectionStart = input.selectionEnd = stripped.length - caretDistFromEnd;
            }

            onInput && onInput(e);
          },
          onKeyPress: e => {
            let charCode = e.charCode;
            let char = String.fromCharCode(charCode);

            if(!char) {
              return;//A key that doesn't map to a character - I don't think this can happen?
            }

            //only allow characters that might be part of an IP address to be typed
            if((allowIPv6 ? '.0123456789:abcdefABCDEF/' : '.0123456789').indexOf(char) === -1) {
              e.preventDefault();
              return;
            }

            onKeyPress && onKeyPress(e);
          },
          setValue: (str, e) => {
            //check if the value is definitely NOT a valid IP address or is
            //definitely valid
            checkIsValid(str, allowIPv6);

            setValue && setValue(str, e);
          }
        }
      }//end of map props
    }
  ),
  BEMComponent('form', {
    ...inputModifiers,
    type: {
      type: PropTypes.oneOf(['ipAddress']),
      default: 'ipAddress'
    },
    valid: {
      type: PropTypes.oneOf([VALID, INVALID, NOT_INVALID]),
      default: NOT_INVALID
    }
  })
)(InputText)

export default Component;

/*
export const ValidatedInputText = ValidatedInputComponent({
  type: 'text',
  rules: [requiredTest, minLengthTest, maxLengthTest, patternTest]
})(Component);
*/
