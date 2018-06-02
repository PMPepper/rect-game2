import React from 'react';


function isNotSet(props, propName) {
  return !props.hasOwnProperty(propName) || props[propName] === null || props[propName] === undefined;
}

function makeProp(test) {
  function propTest(props, propName, componentName) {
    if(isNotSet(props, propName)) {
      return null;
    }

    return test(props, propName, componentName);
  }

  propTest.isRequired = test;

  return propTest;
}

//Number based props
export const isInteger = makeProp(function isInteger(props, propName, componentName) {
  const prop = props[propName];

  if(!Number.isInteger(prop)) {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Must be an integer, was '${prop}'`);
  }

  return null;
});

export const isPositiveInteger = makeProp(function isPositiveInteger(props, propName, componentName) {
  const prop = props[propName];

  if(!Number.isInteger(prop) && prop >= 0) {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Must be a positive integer, was '${prop}'`);
  }

  return null;
});

export const isPositiveNonZeroInteger = makeProp(function isPositiveNonZeroInteger(props, propName, componentName) {
  const prop = props[propName];

  if(!Number.isInteger(prop) || prop < 1) {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Must be a positive integer greater than 0, was '${prop}'`);
  }

  return null;
});

export const isIntegerInRange = function(min, max) {
  return makeProp(function isIntegerInRange(props, propName, componentName) {
    const prop = props[propName];

    if(!Number.isInteger(prop) || prop < min || prop > max) {
      return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Must be a positive integer greater between ${min} and ${max}, was '${prop}'`);
    }

    return null;
  });
}

export const isPositiveNumber = makeProp(function isPositiveNumber(props, propName, componentName) {
  const prop = +props[propName];

  if(isNaN(prop) || prop < 0) {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Must be a positive number, was '${prop}'`);
  }

  return null;
});

export const isPositiveNonZeroNumber = makeProp(function isPositiveNonZeroNumber(props, propName, componentName) {
  const prop = +props[propName];

  if(isNaN(prop) || prop <= 0) {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Must be a number greater than 0, was '${prop}'`);
  }

  return null;
});



//React specific prop types
export const isReactRenderable = makeProp(function isReactRendable(props, propName, componentName) {
  const prop = props[propName];

  switch(typeof(prop)) {
    case 'string':
    case 'number':
    case 'boolean':
    //case 'function':
      return null;
    case 'object':
      if(prop instanceof Array || React.isValidElement(prop)) {
        return null;
      }
  }

  return new Error(`Invalid prop ${propName} supplied to ${componentName}. Is not rendable by React, was '${prop}'`)
})

export const isReactComponent = makeProp(function isReactComponent(props, propName, componentName) {
  const prop = props[propName];

  //TODO actually implement - is this a string or a function? Right? A react class object is still a function

  return null;
})

export const isReactElement = makeProp(function isReactElement(props, propName, componentName) {
  const prop = props[propName];

  if(!React.isValidElement(prop)) {
    return new Error(`Invalid prop ${propName} supplied to ${componentName}. Is not a valid react element, was '${prop}'`)
  }

  return null;
});

export const isValue = (value) => {
  return makeProp(function isValue(props, propName, componentName) {
    const prop = props[propName];

    return prop !== value ? new Error(`Invalid prop ${propName} supplied to ${componentName}. Is not value '${value}', was '${prop}'`) : null;
  });
}
