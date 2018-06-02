import React from 'react';
import PropTypes from 'prop-types';


//This component is Pure

export default function Text({id, text, strings}) {
  if(id && strings && strings[id]) {
    return strings[id];
  }

  return text || id || null;
}

Text.defaultProps = {
  text: null
}

Text.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  strings: PropTypes.object.isRequired
};

Text.displayName = 'Text';
