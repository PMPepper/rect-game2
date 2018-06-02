import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';


//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Presentational
import Panel from '../presentational/Panel';


//the component
const Component = compose(
  BEMComponent('panel', {
    theme: {
      type: PropTypes.oneOf(['light', 'dark']),
      default: 'light',
      preset: 'light'
    },
    stretchContents: {
      type: PropTypes.bool,
      default: false,
      preset: false
    },
    valign: {
      type: PropTypes.oneOf(['bottom', 'top', 'middle']),
      default: 'top',
      preset: 'top'
    },
    fullHeight: {
      type: PropTypes.bool,
      default: false,
      preset: false
    }
  })
)(Panel);


export default Component;
