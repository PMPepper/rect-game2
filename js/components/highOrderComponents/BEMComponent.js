import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';

import {getClassName} from '../../helpers/BEM';//TODO need to add this helper
import {mapObj} from '../../helpers/Object';


///////////////////
// The Component //
///////////////////

//This component is Pure

/*
propertyRules:

Defines the BEM modifiers in use by this component.

-Type is the prop-type property. Also, required or not.
-Default value is the value that will be used if none is supplied.
-Preset is that value that means no modifier class needs to be added if this value is used.

const exampleProps = {
  theme: {
    type: PropTypes.oneOf(['light', 'dark', 'error', 'warning']),
    preset: 'light',
    default: 'light'
  },

};


//mapToProps:

function that maps the additional props added by this method (baseClassName, baseClass,
getElementClass) to the props desired by the wrapped component. Defaults to
passthroughs. Takes two arguments, an object with those values, and the current
props being passed to the wrapped component (except children).

-baseClassName is a string of the raw BEM component e.g. tabs.
-baseClass is a string of the full class to be applied to the base element
 (includes modifier classes)
-getElementClass is a function that allows the wrapped component to build
 classes for elements that include modifiers


//mergeProps

function that merges the output of mapToProps with the other props passed to
the wrapped component. Defaults to: {...ownProps, ...mappedProps};
*/

export default function BEMComponent(defaultBaseClassName, propertyRules = {}, mapToProps = passthrough, mergeProps = simpleMerge) {
  const defaultProps = mapObj(propertyRules, rules => (rules['default']));
  const propTypes = mapObj(propertyRules, rules => (rules.type));
  const propPresets = mapObj(propertyRules, rules => (rules.preset));
  const modifiers = Object.keys(propertyRules);

  function getBEMClassName(element, componentModifiers, customModifiers) {
    const mergedModifiers = customModifiers === false ? null : {...modifiers.reduce((mergedModifiers, modifier) => {
      let value = componentModifiers[modifier];

      if(value === undefined ||
         value === propPresets[modifier] ||
         value === false ||
         value === null) {
        //can only be undefined if no default was set AND no value was passed
        //(or was passed as undefined). This means do not add modifier class.

        //If the value matches the preset, do not add modifier class.

        //if the value is Boolean false, do not add modifier class.

        //if the value is null, do not add modifier class. This is for optional
        //values that need to override defaults
        return mergedModifiers;
      }

      if(value === true) {
        //A boolean true value mean output modifier without a value
        mergedModifiers[modifier] = null;
      } else {
        mergedModifiers[modifier] = value;
      }

      return mergedModifiers;
    }, {}), ...customModifiers};

    return getClassName(element, mergedModifiers);
  }

  return (WrappedComponent) => {
    const Component = function({children, bemClassName = null, ...rest}) {
      return <WrappedComponent {...mergeProps(mapToProps({
        baseClassName: bemClassName,
        baseClass: getBEMClassName(bemClassName, rest),
        getElementClass: (elementName, additionalModifiers) => {
            return getBEMClassName(
              elementName ? elementName instanceof Array ? [bemClassName, ...elementName] : [bemClassName, elementName] : bemClassName,
              rest,
              additionalModifiers
            );
          }
        }, rest), rest)}>
        {children}
      </WrappedComponent>
    }

    Component.defaultProps = {
      ...defaultProps,
      bemClassName: defaultBaseClassName
    }

    Component.propTypes = propTypes;

    Component.displayName = `BEMComponent(${getDisplayName(WrappedComponent)})`;

    return Component;
  };
};

//////////////////////
// Helper functions //
//////////////////////

function simpleMerge(mappedProps, ownProps) {
  return {...ownProps, ...mappedProps};
}

const passthrough = arg => (arg);

///////////////
// Constants //
///////////////

export const propTypes = Object.freeze({
  baseClass: PropTypes.string.isRequired,
  getElementClass: PropTypes.func.isRequired
});
