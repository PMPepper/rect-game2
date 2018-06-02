import React from 'react';
import PropTypes from 'prop-types';

//helpers
import {propTypes} from '../../highOrderComponents/BEMComponent';
import {isPositiveInteger} from '../../../helpers/ExtendedPropTypes';


//components
export default function InputRadio({
  baseClass, baseClassName, getElementClass, modifiers,
  autoFocus, disabled, id, name, readOnly, required, value,
  onBlur, onFocus, onInput,
  getRef,
  setValue
}) {
  return <span className={getElementClass('fieldWrapper', modifiers)}>
    <input
      className={getElementClass('input', modifiers)}
      type="radio"

      autoFocus={autoFocus}
      disabled={disabled}
      id={id}
      name={name}
      readOnly={readOnly}
      required={required}
      value={value || ''}

      onBlur={onBlur}
      onChange={setValue ? (e) => {
        setValue(e.target.value, e)
      } : null}
      onFocus={onFocus}
      onInput={onInput}

      ref={getRef}
    />
  </span>
}


InputRadio.defaultProps = {
  value: '',
  modifiers: null,
  onInput: null
};

InputRadio.propTypes = {
  //BEM stuff
  ...propTypes,
  modifiers: PropTypes.object,

  //required/important
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,

  //other stuff
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool
};
