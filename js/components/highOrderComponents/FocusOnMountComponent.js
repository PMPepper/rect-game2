import React from 'react';
import {getDisplayName} from 'recompose';

import {mergeElementProps} from '../../helpers/React';

export default function({
  tabIndex = 0,
  returnFocusOnUnmount = false
} = {}) {
  return (PresentationalComponent) => {
    return class FocusOnMountComponent extends React.Component{
      componentWillMount() {
        if(returnFocusOnUnmount) {
          this._initialFocusElement = document.activeElement
        }
      }
      componentDidMount() {
        if(this.element) {
          this.element.focus();
        }
      }

      componentWillUnmount() {
        this.element = null;

        if(returnFocusOnUnmount && this._initialFocusElement) {
          //TODO check if element still exists (is in DOM)? If not...?
          this._initialFocusElement.focus();

          this._initialFocusElement = null;
        }
      }

      render() {
        const {elementProps, ...rest} = this.props;

        return <PresentationalComponent elementProps={mergeElementProps(elementProps, {
          tabIndex,
          ref: (element) => {
            this.element = element;
          }
        })} {...rest} />
      }

      displayName = `FocusOnMountComponent(${getDisplayName(PresentationalComponent)})`
    };
  }
}
