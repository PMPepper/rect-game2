import React from 'react';
import {getDisplayName} from 'recompose';
import {cloneObjectWithoutKeys} from '../../../helpers/Helpers';

import {isDOMComponent} from '../../../helpers/ReactHelpers';

const promsToOmit = ['onChanged', 'ref', 'getRef'];

export default function InputOnChangedComponent() {
  return (PresentationalComponent) => {
    const isDOM = isDOMComponent(PresentationalComponent);

    const Component = (props) => {

      let onNewElem = props.getRef || null;

      //If there is an onChanged handler, set a then add a 'change' event
      //directly to the DOM element, using the ref/getRef handler
      if(props.onChanged instanceof Function) {
        let currentElem = null;

        onNewElem = (elem) => {
          if(currentElem) {
            currentElem.removeEventListener('change', props.onChanged);
          }

          currentElem = elem;

          if(elem) {
            currentElem.addEventListener('change', props.onChanged);
          }

          //Call parent getRef if set
          props.getRef && props.getRef(elem);
        }
      }

      return isDOM ?
        <PresentationalComponent ref={onNewElem} {...cloneObjectWithoutKeys(props, promsToOmit)} />
        :
        <PresentationalComponent getRef={onNewElem} {...cloneObjectWithoutKeys(props, promsToOmit)} />
    }

    Component.displayName = `InputOnChangedComponent(${getDisplayName(PresentationalComponent)})`

    return Component;
  }
};
