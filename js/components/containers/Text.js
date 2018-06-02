import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Text from '../presentational/Text';

//this component is pure

export default connect(
  (state) => {
    return {
      strings: state.localisation.strings
    };
  }, {}
)(Text);
