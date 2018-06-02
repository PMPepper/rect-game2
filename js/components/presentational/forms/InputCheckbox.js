import React from 'react';
import PropTypes from 'prop-types';

//Presentational
import InputOnChanged from './InputOnChanged';

//Other
import {propTypes} from '../../highOrderComponents/BEMComponent';


//Consts
const stopPropagation = e => {e.stopPropagation();}


const InputCheckbox = ({
  baseClass, baseClassName, getElementClass,
  id, className, indeterminate, checked, disabled, setValue, children,
  checkboxProps = null, elementProps = null, getRef = null
}) => {
  return <span className={getElementClass('input')} {...elementProps} ref={getRef}>
    <Checkbox
      indeterminate={indeterminate}
      elementProps={
        {
          className: 'u-offscreen',
          onClick: stopPropagation,
          onKeyPress: stopPropagation,
          ...checkboxProps,
          id,
          checked,
          disabled: !!disabled,
          onChange: (e) => {
            setValue && setValue(e.target.checked);
          }
        }
      }
    />
    <label
      className={getElementClass(['input', 'label'])+(className ? ' '+className : '')}
      htmlFor={id}
    >
      {checked && !indeterminate && <i className={getElementClass(['input', 'label', 'icon', 'checked'])+' fa fa-check-square-o'} aria-hidden="true"></i>}
      {(!checked || indeterminate) && <i className={getElementClass(['input', 'label', 'icon', 'checked'])+' fa fa-square-o'} aria-hidden="true"></i>}
      {indeterminate && <i className={getElementClass(['input', 'label', 'icon', 'indeterminate'])+' fa fa-square'} aria-hidden="true"></i>}
      {children}
    </label>
  </span>
};

InputCheckbox.defaultProps = {
  baseClass: 'checkbox',
  onClick: (e) => {e.stopPropagation();},
}

InputCheckbox.propTypes = {
  ...propTypes,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  indeterminate: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  setValue: PropTypes.func
};

export default InputCheckbox;



//Internal component
export const Checkbox = ({indeterminate = false, elementProps = null, getRef = null, }) => (
  <InputOnChanged
    elementProps={{
      type: 'checkbox',
      ...elementProps
    }}
    getRef={input => {
      if (input) {
        input.indeterminate = indeterminate;
      }

      getRef && getRef(input);
    }}
  />
);

Checkbox.propTypes = {
  indeterminate: PropTypes.bool,
  getRef: PropTypes.func,
  elementProps: PropTypes.object
};
