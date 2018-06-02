import React from 'react';
import PropTypes from 'prop-types';

//containers

//Helpers
import {propTypes} from '../../highOrderComponents/BEMComponent';

export default function FieldInfo({baseClass, baseClassName, getElementClass, children}) {
  return <span className={getElementClass('info')}>
    {children}
  </span>
}

FieldInfo.propTypes = {
  ...propTypes
};
