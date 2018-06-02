import React from 'react';
import ReactDOM from 'react-dom';
import {compose, getDisplayName} from 'recompose';

import {getElement} from '../../helpers/DOM';

//HOCs
import WithStateHandlersComponent from './WithStateHandlersComponent';

/*Needs:

-the contents (as an element, so it can measure it's size)
-The bounds (optional?)
-where it should be positioned (x/y + width/height OR top right bottom left?)

*/

//The component
export default function PositionedItemComponent({
  defaultPortalElement = document.body,
  usePortal = true,
  xPosRule = alignStart,
  yPosRule = afterOrBefore,
  mapProps = ({positionedItemX, positionedItemY, setPositionedItemElement, portalElement,
    positionedItemMId, positionedItemContentWidth, positionedItemContentHeight, boundsX, boundsY,
    boundsWidth, boundsHeight, positionX, positionY, positionWidth,
    positionHeight, positionedItemElement, setContentSize,
    ...rest
  }) => (rest)
} = {}) {


  return (PresentationalComponent) => {
    const Component = (props) => {
      const element = <div className="positionedElement" ref={props.setPositionedItemElement} style={{
        left: `${props.positionedItemX}px`,
        top: `${props.positionedItemY}px`
      }}>
        <PresentationalComponent {...mapProps(props)} />
      </div>;

      return usePortal ? ReactDOM.createPortal(element, getElement(props.portalElement || defaultPortalElement)) : element;
    }

    Component.displayName = `PositionedItemComponent${getDisplayName(PresentationalComponent)}`;

    return compose(
      WithStateHandlersComponent({
          positionedItemX: 0,
          positionedItemY: 0,
          positionedItemElement: null,
          positionedItemContentWidth: 0,
          positionedItemContentHeight: 0,
          positionedItemMId: null
        }, {
          setContentSize: () => (positionedItemContentWidth, positionedItemContentHeight) => ({positionedItemContentWidth, positionedItemContentHeight}),
          setPositionedItemElement: ({positionedItemMId, setContentSize}) => (positionedItemElement) => {
            if(positionedItemMId) {
              clearInterval(positionedItemMId);
              positionedItemMId = null;
            }

            //monitor for size changes
            if(positionedItemElement) {
              positionedItemMId = setInterval(() => {
                setContentSize(positionedItemElement.clientWidth, positionedItemElement.clientHeight);
              }, 1000 / 60);
            }

            return {positionedItemElement, positionedItemMId, positionedItemContentWidth: positionedItemElement ? positionedItemElement.clientWidth : 0, positionedItemContentHeight: positionedItemElement ? positionedItemElement.clientHeight : 0};
          }
        }, {
          withPropsOnChange: [
            (props, nextProps) => {
              const havePropsChanged =
                props.positionedItemContentWidth !== nextProps.positionedItemContentWidth ||
                props.positionedItemContentHeight !== nextProps.positionedItemContentHeight ||
                props.boundsX !== nextProps.boundsY ||
                props.boundsY != nextProps.boundsY ||
                props.boundsWidth !== nextProps.boundsWidth ||
                props.boundsHeight !== nextProps.boundsHeight ||
                props.positionX !== nextProps.positionX ||
                props.positionY !== nextProps.positionY ||
                props.positionWidth !== nextProps.positionWidth ||
                props.positionHeight !== nextProps.positionHeight;

              return havePropsChanged;
            },
            ({positionedItemContentWidth, positionedItemContentHeight, boundsX, boundsY, boundsWidth, boundsHeight, positionX, positionY, positionWidth = 0, positionHeight = 0}) => {
              return {
                positionedItemX: xPosRule(positionedItemContentWidth, boundsX, boundsWidth, positionX, positionWidth),
                positionedItemY: yPosRule(positionedItemContentHeight, boundsY, boundsHeight, positionY, positionHeight),
              };//TODO calculate where the element should be positioned
            }
          ],
          //tidy up
          componentWillUnmount: ({positionedItemMId}) => {
            if(positionedItemMId) {
              clearInterval(positionedItemMId);
            }
          }
        }
      )
    )(Component);
  };
}

//methods for calculating position

// If possible aligns the start of the content with the start of the position.
// If this is not possible, positions the content as close as it can to that point
// whilst still within the bounds
export function alignStart (contentSize, boundsStart, boundsSize, positionStart, positionSize) {
  if(boundsStart === null || boundsStart === undefined || boundsSize === null || boundsSize === undefined) {
    return positionStart;
  }

  const boundsEnd = boundsStart + boundsSize;

  return positionStart + contentSize <= boundsEnd ? positionStart : boundsEnd - contentSize;
}

// If possible positions the start of the content with with start of the position.
// If this is not possible, positions the end of the content to align with the start
// of the position
export function afterOrBefore (contentSize, boundsStart, boundsSize, positionStart, positionSize) {
  if(boundsStart === null || boundsSize === undefined) {
    return positionStart + positionSize;
  }

  return positionStart + positionSize + contentSize <= boundsStart + boundsSize ? positionStart + positionSize : positionStart - contentSize;
}

export function startOrEnd (contentSize, boundsStart, boundsSize, positionStart, positionSize) {
  if(boundsStart === null || boundsSize === undefined) {
    return positionStart;
  }

  return positionStart + contentSize <= boundsStart + boundsSize ? positionStart : positionStart + positionSize - contentSize;
}

export function minWithinBounds(minStart, minEnd) {
  return (contentSize, boundsStart, boundsSize, positionStart, positionSize) => {
    if(boundsStart === null || boundsSize === undefined) {
      return positionStart;
    }


    if(minStart < 0) {
      if(boundsStart + minStart > positionStart) {
        return boundsStart + minStart;
      }
    } else {
      if(boundsStart + minStart - contentSize > positionStart) {
        return boundsStart + minStart - contentSize;
      }
    }

    const boundsEnd = boundsStart + boundsSize;

    if(minEnd < 0) {
      if(positionStart + contentSize + minEnd > boundsEnd) {
        return boundsEnd - minEnd - contentSize;
      }
    } else {
      if(positionStart + minEnd > boundsEnd) {
        return boundsEnd - minEnd;
      }
    }

    //TODO
    return positionStart;
  }
}
