import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';

//HOCs
import BEMComponent from '../BEMComponent';


//containers
import Text from '../../containers/Text';
import FormattedText from '../../containers/FormattedText';

//vars
import {inputModifiers} from '../../../vars/FormModifiers';
import {propTypes as bemPropTypes} from '../BEMComponent';

//helpers
import {isPositiveInteger, isReactRenderable, isReactComponent} from '../../../helpers/ExtendedPropTypes';

const propTypes = {
  ...propTypes,
  required: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  maxLength: isPositiveInteger,
  minLength: isPositiveInteger,
  pattern: PropTypes.string,
  displayErrors: PropTypes.bool,
  setIsFieldValid: PropTypes.func,
  prepend: isReactRenderable,
  component: isReactComponent,
  rules: PropTypes.arrayOf(PropTypes.func),
  customErrorMessages: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.string]))
}


export default function ValidatedInputComponent({
  type,
  defaultBaseClass = 'form',
  defaultComponent = 'span',
  errorRenderer = defaultErrorRenderer,
  rules = null,
} = {}) {
  return function(PresentationalComponent) {
    function ValidatedInput(props) {
      let {
        baseClass, baseClassName, getElementClass,
        value, required = false,
        max = null, maxLength = null, min = null, minLength = null, pattern = null,
        displayErrors = false,
        setIsFieldValid = null,
        prepend = null, component: Component = defaultComponent,
        children,
        rules: fieldRules = null,
        ...rest
      } = props;

      //check for errors
      const errors = [];

      //general rules
      rules && rules.forEach((rule) => {
        const result = rule(value, props, errorRenderer);//check for errors

        if(result) {
          errors.push(result);
        }
      }, errors);

      //field specific rules
      fieldRules && fieldRules.forEach((rule) => {
        const result = rule(value, props, errorRenderer);//check for errors

        if(result) {
          errors.push(result);
        }
      }, errors);

      const hasErrors = errors && errors.length > 0;
      const isDisplayingErrors = displayErrors && hasErrors;

      //record if field is valid
      setIsFieldValid && setIsFieldValid(!hasErrors);

      return <Component className={getElementClass('fieldHolder', {error: isDisplayingErrors ? null : undefined})}>
        {prepend}{/*prepend - misc content*/}
        <PresentationalComponent
          {...rest}
          value={value}
          required={required}
          max={max}
          maxLength={maxLength}
          min={min}
          minLength={minLength}
          pattern={pattern}
          error={isDisplayingErrors}
        />
        {isDisplayingErrors && <span className={getElementClass('errors')}>{errors.map((error) => {
          return <span className={getElementClass(['errors', 'error'])} key={error.key}>{error}</span>
        })}</span>}
        {/*append - button, misc, errors, capslock warning, tooltip, info*/}
        {children}
      </Component>
    }

    ValidatedInput.propTypes = propTypes;
    ValidatedInput.defaultProps = {
      value: ''
    };

    ValidatedInput.displayName = `ValidatedInputComponent(${getDisplayName(PresentationalComponent)})`

    return BEMComponent(
      defaultBaseClass,
      {
        ...inputModifiers,
        type: {
          type: PropTypes.oneOf([type]),
          default: type
        }
      }
    )(
      ValidatedInput
    );
  }
}

//Helper methods
function defaultErrorRenderer(errorType, customErrorMessages = null, errorParams = null) {
  if(customErrorMessages && (errorType in customErrorMessages)) {
    return (customErrorMessages[errorType] instanceof Function) ? customErrorMessages[errorType]({errorType, errorParams}) : customErrorMessages[errorType];
  }

  if(!errorParams) {
    return <Text id={`form-error-${errorType}`} key={errorType} />;
  }

  return <FormattedText id={`form-error-${errorType}`} params={errorParams} key={errorType} />;
}
