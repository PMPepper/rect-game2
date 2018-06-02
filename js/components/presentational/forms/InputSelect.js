import React from 'react';
import PropTypes from 'prop-types';

//helpers
import {propTypes} from '../../highOrderComponents/BEMComponent';
import {isReactRenderable} from '../../../helpers/ExtendedPropTypes';
//import {isPositiveInteger} from '../../../helpers/ExtendedPropTypes';

//TODO multiple?
//readonly - does this work?

//components
export default function InputSelect({
  baseClass, baseClassName, getElementClass, modifiers,
  autoFocus, disabled, id, name, readOnly, required, value,
  options,
  onBlur, onFocus,
  getRef,
  setValue
}) {
  const optionElements = options.map((option) => {
    let value = null, label = null, type = typeof(option);

    switch(type) {
      case 'string':
      case 'number':
      case 'boolean':
        value = label = option.toString();
        break;
      case 'undefined':
        return null;
      default://object, function, symbol
        if(option === null) {
          return null;
        } else {
          value = option.value || null;
          label = option.label || null;
        }
        break;
    }

    return <option key={value} value={value}>{label}</option>;
  });

  return <span className={getElementClass('fieldWrapper', modifiers)}>
    <select
      className={getElementClass('input', modifiers)}
      type="text"

      autoFocus={autoFocus}
      disabled={disabled}
      id={id}
      name={name}
      //readOnly={readOnly}
      required={required}
      value={value || ''}

      onBlur={onBlur}
      onChange={setValue ? (e) => {
        setValue(e.target.value, e)
      } : null}
      onFocus={onFocus}

      ref={getRef}
    >
      {optionElements}
    </select>
  </span>
}


InputSelect.defaultProps = {
  value: '',
  modifiers: null
};

InputSelect.propTypes = {
  //BEM stuff
  ...propTypes,
  modifiers: PropTypes.object,

  //required/important
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.func,
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, isReactRenderable]).isRequired
    })
  ])).isRequired,

  //other stuff
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  //readOnly: PropTypes.bool,
  required: PropTypes.bool
};
