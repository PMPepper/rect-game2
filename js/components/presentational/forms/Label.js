import React from 'react';
import PropTypes from 'prop-types';

//containers

//Helpers
import {propTypes} from '../../highOrderComponents/BEMComponent';

export default function Label({baseClass, baseClassName, getElementClass, htmlFor, children}) {
  return <label className={getElementClass('label')} htmlFor={htmlFor}>
    {/*prepend*/}
    {children}
    {/*append*/}
  </label>
}

Label.propTypes = {
  ...propTypes,
  htmlFor: PropTypes.string
};
