import React from 'react';

import {isDOMComponent} from '../../../helpers/ReactHelpers';

export default function InputOnChanged({component: Component = 'input', onChanged, elementProps = null, getRef = null}) {
  let onNewElem = null;

  if(onChanged) {
    let currentElem = null;

    onNewElem = (elem) => {
      if(currentElem) {
        currentElem.removeEventListener('change', domOnChange);
      }

      currentElem = elem;

      if(elem) {
        currentElem.addEventListener('change', domOnChange);
      }

      if(getRef) {
        getRef(elem);
      }
    }

    const domOnChange = (e) => {
      onChanged(e);
    }
  } else {
    onNewElem = getRef ? getRef : null;
  }

  return isDOMComponent(Component) ?
    <Component ref={onNewElem} {...elementProps} />
    :
    <Component getRef={onNewElem} {...elementProps} />
}
