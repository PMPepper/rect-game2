import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import FormattedText from '../presentational/FormattedText';

//This component is Pure

export default connect(
  (state) => {
    return {
      strings: state.localisation.strings
    };
  }, {}
)(FormattedText);
