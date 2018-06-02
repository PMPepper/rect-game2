import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';

//presentational
import InputRadio from '../../presentational/forms/InputRadio';

//helpers

//vars
import {inputModifiers} from '../../../vars/FormModifiers';

//the component
const Component = compose(
  BEMComponent('form', {
    ...inputModifiers,
    type: {
      type: PropTypes.oneOf(['radio']),
      default: 'radio'
    },
    style: {
      type: PropTypes.oneOf(['radio']),
      default: 'radio'
    }
  })
)(InputRadio)

export default Component;
