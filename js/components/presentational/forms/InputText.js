import React from 'react';
import PropTypes from 'prop-types';

//helpers
import {propTypes} from '../../highOrderComponents/BEMComponent';
import {isPositiveInteger} from '../../../helpers/ExtendedPropTypes';


//components
export default function InputText({
  baseClass, baseClassName, getElementClass, modifiers,
  autoComplete, autoCorrect, autoCapitalize, autoFocus, disabled, id, inputMode, maxLength, name, pattern, placeholder, readOnly, required, spellCheck, value,
  onBlur, onFocus, onInput, onKeyPress,
  getRef,
  setValue
}) {
  return <span className={getElementClass('fieldWrapper', modifiers)}>
    <input
      className={getElementClass('input', modifiers)}
      type="text"

      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      autoFocus={autoFocus}
      disabled={disabled}
      id={id}
      inputMode={inputMode}
      maxLength={maxLength}
      name={name}
      pattern={pattern}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      spellCheck={spellCheck}
      value={value || ''}

      onBlur={onBlur}
      onChange={setValue ? (e) => {
        setValue(e.target.value, e)
      } : null}
      onFocus={onFocus}
      onInput={onInput}
      onKeyPress={onKeyPress}

      ref={getRef}
    />
  </span>
}


InputText.defaultProps = {
  value: '',
  modifiers: null,
  onInput: null,
  onKeyPress: null,
  autoCorrect: null,//TODO proptypes
  autoCapitalize: null,
  spellCheck: null,
  inputMode: null
};

InputText.propTypes = {
  //BEM stuff
  ...propTypes,
  modifiers: PropTypes.object,

  //required/important
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,

  //other stuff
  autoComplete: PropTypes.oneOf(['off', 'on', 'name', 'honorific-prefix',
    'given-name', 'additional-name', 'family-name', 'honorific-suffix',
    'nickname', 'email', 'username', 'new-password', 'current-password',
    'organization-title', 'organization', 'street-address', 'address-line1',
    'address-line2', 'address-line3', 'address-level1', 'address-level2',
    'address-level3', 'address-level4', 'country', 'country-name', 'postal-code',
    'cc-name', 'cc-given-name', 'cc-additional-name', 'cc-family-name',
    'cc-number', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 'cc-csc', 'cc-type',
    'transaction-currency', 'transaction-amount', 'language', 'bday', 'bday-day',
    'bday-month', 'bday-year', 'sex', 'tel', 'tel-country-code', 'tel-national',
    'tel-area-code', 'tel-local', 'tel-local-prefix', 'tel-local-suffix',
    'tel-extension', 'url', 'photo'
  ]),
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  maxLength: isPositiveInteger,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool
};
