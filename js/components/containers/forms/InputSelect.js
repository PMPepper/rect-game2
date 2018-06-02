import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

//HOCs
//import RestrictedInputComponent from '../../highOrderComponents/forms/RestrictedInputComponent';
import BEMComponent from '../../highOrderComponents/BEMComponent';
import ValidatedInputComponent from '../../highOrderComponents/forms/ValidatedInputComponent';

//presentational
import InputSelect from '../../presentational/forms/InputSelect';

//helpers
import {requiredTest} from '../../../logic/FormValidation';

//vars
import {inputModifiers} from '../../../vars/FormModifiers';

//the component
const Component = compose(
  BEMComponent('form', {
    ...inputModifiers,
    type: {
      type: PropTypes.oneOf(['select']),
      default: 'select'
    }
  })
)(InputSelect)

export default Component;

export const ValidatedInputSelect = ValidatedInputComponent({
  type: 'select',
  rules: [requiredTest]
})(Component);
