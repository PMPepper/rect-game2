function makePropTest(prop, isSetTestFunc, testFunc, errorType, toErrorProps) {
  return function (value, props, errorRenderer) {
    return isSetTestFunc(prop, props) ?
      testFunc(value, props) ?
        false
        :
        errorRenderer(errorType, props.customErrorMessages, toErrorProps ? toErrorProps(props) : null)
      :
      false;
  }
}

export function isPropSet(prop, props) {
  return prop in props;
}

export function isPropTrue(prop, props) {
  return props[prop] === true;
}

export function isPropTruthy(prop, props) {
  return !!props[prop];
}


//standard validation tests
export function isNotEmpty(value) {
  return value !== '' && value !== null && value !== undefined;
}

export function minLength(value, props) {
  if(typeof(value) !== 'string' && (!value || !('length' in value))) {
    throw new Error(`Value does not have a 'length', was: '${value}'`);
  }

  return value.length >= props.minLength
}

export function maxLength(value, props) {
  if(typeof(value) !== 'string' && (!value || !('length' in value))) {
    throw new Error(`Value does not have a 'length', was: '${value}'`);
  }

  return value.length <= props.maxLength;
}

export function pattern(value, props) {
  const regex = new RegExp(`^${props.pattern}$`, 'u');

  return regex.test(value);
}

export function minValue(value, props) {
  const numericValue = +value;

  if(isNaN(numericValue)) {
    throw new Error(`Value is not numeric, was: '${value}'`);
  }

  return numericValue >= props.min;
}

export function maxValue(value, props) {
  const numericValue = +value;

  if(isNaN(numericValue)) {
    throw new Error(`Value is not numeric, was: '${value}'`);
  }

  return numericValue <= props.max;
}

//prop test functions
export const requiredTest = makePropTest('required', isPropTruthy, isNotEmpty, 'fieldIsRequired');
export const minValueTest = makePropTest('min', isPropSet, minValue, 'valueTooSmall', props => ([props.min]));
export const maxValueTest = makePropTest('max', isPropSet, maxValue, 'valueTooLarge', props => ([props.max]));
export const minLengthTest = makePropTest('minLength', isPropSet, minLength, 'valueTooShort', props => ([props.minLength, props.value.length, props.minLength - props.value.length]));
export const maxLengthTest = makePropTest('maxLength', isPropSet, maxLength, 'valueTooLong', props => ([props.maxLength, props.value.length, props.value.length - props.maxLength]));
export const patternTest = makePropTest('pattern', isPropTruthy, pattern, 'patternNotMatched');
