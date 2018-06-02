import React from 'react';
import {compose, getDisplayName} from 'recompose';

//HOCs
import WithStateHandlersComponent from './WithStateHandlersComponent';

export default function({
  component: DOMComponent = 'div'
} = {}) {
  return (PresentationalComponent) => {
    const Component = ({keyboardInputOnKeyDown, keyboardInputOnKeyUp, keyboardInputBlur, ...props}) => {
      //TODO merge props into element using elementProps instead of using separate DOM element? 
      return <DOMComponent tabIndex={0} autoFocus={true} onKeyDown={keyboardInputOnKeyDown} onKeyUp={keyboardInputOnKeyUp} onBlur={keyboardInputBlur}>
        <PresentationalComponent {...props} />
      </DOMComponent>
    };

    Component.displayName = `keyboardInputComponent(${getDisplayName(PresentationalComponent)})`;

    return compose(
      WithStateHandlersComponent({
        keyboard: {}
      }, {
        keyboardInputOnKeyDown: ({keyboard}) => (e) => {
          return {
            keyboard: {
              ...keyboard,
              [e.which]: true
            }
          };
        },
        keyboardInputOnKeyUp: ({keyboard}) => (e) => {
          return {
            keyboard: {
              ...keyboard,
              [e.which]: false
            }
          };
        },
        keyboardInputBlur: () => () => ({keyboard: {}})
      })
    )(Component);
  };
}
