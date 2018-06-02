import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';
import ValidatedInputComponent from '../../highOrderComponents/forms/ValidatedInputComponent';

//presentational
import InputCheckbox from '../../presentational/forms/InputCheckbox';

//helpers
import {requiredTest} from '../../../logic/FormValidation';

//vars
import {inputModifiers} from '../../../vars/FormModifiers';

//the component
const Component = compose(
  BEMComponent('form', {
    ...inputModifiers,
    type: {
      type: PropTypes.oneOf(['checkbox']),
      default: 'checkbox'
    },
    style: {
      type: PropTypes.oneOf(['checkbox']),
      default: 'checkbox'
    },
    indeterminate: {
      type: PropTypes.bool,
      default: false,
      preset: false
    }
  })
)(InputCheckbox)

export default Component;

export const ValidatedInputText = ValidatedInputComponent({
  type: 'checkbox',
  rules: [requiredTest]
})(Component);
