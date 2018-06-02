import PropTypes from 'prop-types';


//helpers
import {isPositiveNonZeroInteger} from '../helpers/ExtendedPropTypes';

export const theme = {
  type: PropTypes.oneOf(['default', 'login']),
  default: 'default'
};

export const cols = {
  type: isPositiveNonZeroInteger,
  default: 2
}

export const style = {
  type: PropTypes.string,
  default: 'textfield'
};

export const inputTypes = ['button', 'checkbox', 'color', 'date', 'datetime-local',
    'email' ,'file', 'hidden', 'image', 'month', 'number', 'password', 'radio',
    'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'
  ]

export const type = {
  type: PropTypes.oneOf(inputTypes),
  default: 'text'
}

export const disabled = {
  type: PropTypes.bool,
  default: false,
  preset: false
}

//form inputs can be of more types than just html input types
export const extendedType = {
  type: PropTypes.oneOf([...inputTypes, 'select']),
  default: 'text'
};

export const error = {
  type: PropTypes.bool,
  default: false,
  preset: false
}

/*
export const width = {
  type: PropTypes.oneOf([100, 80]),
  default: 100,
  preset: 100
}*/

export const inputModifiers = {
  theme,
  cols,
  style,
  error,
  disabled
}

export const rowModifiers = {
  theme,
  cols,
  type: extendedType,
  style,
  error
};

export const labelModifiers = {
  theme,
  cols,
  type: extendedType,
  style,
  error
};

export const infoModifiers = {
  theme,
  cols,
  type: extendedType,
  style,
  error
};
