import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

//HOCs
import RestrictedInputComponent from '../../highOrderComponents/forms/RestrictedInputComponent';
import BEMComponent from '../../highOrderComponents/BEMComponent';
import ValidatedInputComponent from '../../highOrderComponents/forms/ValidatedInputComponent';

//presentational
import InputText from '../../presentational/forms/InputText';

//helpers
import {requiredTest, minLengthTest, maxLengthTest, patternTest} from '../../../logic/FormValidation';

//vars
import {inputModifiers} from '../../../vars/FormModifiers';

//the component
const Component = compose(
  BEMComponent('form', {
    ...inputModifiers,
    type: {
      type: PropTypes.oneOf(['text']),
      default: 'text'
    }
  }),
  RestrictedInputComponent
)(InputText)

export default Component;

export const ValidatedInputText = ValidatedInputComponent({
  type: 'text',
  rules: [requiredTest, minLengthTest, maxLengthTest, patternTest]
})(Component);
