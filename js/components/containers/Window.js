import React from 'react';
import {compose, withProps} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';
import PositionedItemComponent, {minWithinBounds} from '../highOrderComponents/PositionedItemComponent';

//Containers

//Presentational
import Panel from '../presentational/Panel';



export default compose(
  BEMComponent('window'),
  WithStateHandlersComponent(//TEMP - replace with redux state?
    ({positionX, positionY}) => ({positionX, positionY}),
    {
      moveWindowBy: ({positionX, positionY}) => (dx, dy) => {
        return {
          positionX: positionX + dx,
          positionY: positionY + dy
        };
      }
    }
  ),
  WithStateHandlersComponent(
    {
      isMouseDown: false,
      windowMouseX: null,
      windowMouseY: null,
      windowEvents: null
    },
    {
      setIsMouseDown: () => (isMouseDown, windowMouseX = null, windowMouseY = null) => ({isMouseDown, windowMouseX, windowMouseY}),
      setLastMousePos: ({windowMouseX: lastX, windowMouseY: lastY}, {moveWindowBy}) => (windowMouseX, windowMouseY) => {
        //move the window
        moveWindowBy(windowMouseX - lastX, windowMouseY - lastY);

        //record the current mouse position
        return {windowMouseX, windowMouseY};
      }
    },
    {
      withPropsOnChange: [
        ['isMouseDown'],
        ({isMouseDown, setIsMouseDown, setLastMousePos, windowEvents}) => {
          if(isMouseDown) {
            //declare event handlers
            const onMouseMove = (e) => {
              e.preventDefault();

              setLastMousePos(e.clientX, e.clientY);
            };
            const onMouseUp = (e) => {
              setIsMouseDown(false);
            };

            const windowEvents = {
              onMouseMove,
              onMouseUp
            };

            //listen to global mouse events
            addEvents(windowEvents);

            //record event handlers so they can be un-listened later
            return {windowEvents}
          } else {
            //clear global event listeners if they have been set
            if(windowEvents) {
              removeEvents(windowEvents);

              return {
                windowEvents: null
              };
            }
          }
        }
      ],
      componentWillUnmount: ({windowEvents}) => {
        //remove global event listeners
        removeEvents(windowEvents);
      },
      mapProps: ({//Remove internal props
        isMouseDown, windowMouseX, windowMouseY, windowEvents,
        setIsMouseDown, setLastMousePos,
        moveWindowBy,
        ...rest
      }) => {
        return {
          ...rest,
          headProps: {//add dragging handlers
            onMouseDown: (e) => {
              setIsMouseDown(true, e.clientX, e.clientY);
            }
          }
        };
      }
    }
  ),
  PositionedItemComponent({
    usePortal: false,
    xPosRule: minWithinBounds(30, 30),
    yPosRule: minWithinBounds(-15, 15)
  })
)(
  Panel
);

//Helpers methods
function addEvents(windowEvents) {
  window.addEventListener('mousemove', windowEvents.onMouseMove);
  window.addEventListener('mouseup', windowEvents.onMouseUp);
  window.addEventListener('mouseleave', windowEvents.onMouseUp);
}

function removeEvents(windowEvents) {
  if(windowEvents) {
    window.removeEventListener('mousemove', windowEvents.onMouseMove);
    window.removeEventListener('mouseup', windowEvents.onMouseUp);
    window.removeEventListener('mouseleave', windowEvents.onMouseUp);
  }
}
