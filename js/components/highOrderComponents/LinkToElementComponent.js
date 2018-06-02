import React from 'react';
import {getDisplayName} from 'recompose';

//Not sure if I need this

export default function LinkToElementComponent({
  mapLinkedProps = (props, child, showLinkedElement) => {
    return props;
  },
  mapChildProps = (props, child, showLinkedElement) => {
    return {
      key: child.key || 'child'
    }
  }
} = {}) {
  return (PresentationalComponent) => {
    const Component = ({children, showLinkedElement, ...props}) => {
      const child = React.Children.only(children);

      return [
        React.cloneElement(child, mapChildProps(props, child, showLinkedElement)),
        showLinkedElement && <PresentationalComponent key="presentational" {...mapLinkedProps(props, child, showLinkedElement)} />
      ];
    }

    Component.displayName = `LinkToElementComponent(${getDisplayName(PresentationalComponent)})`

    return Component;
  };
}
