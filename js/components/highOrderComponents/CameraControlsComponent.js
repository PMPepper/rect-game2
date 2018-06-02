import React from 'react';
import {compose, getDisplayName} from 'recompose';
import {connect} from 'react-redux';

//HOCs
import WithStateHandlersComponent from './WithStateHandlersComponent';
import KeyboardInputComponent from '../highOrderComponents/KeyboardInputComponent';

//Helpers
import {mergeElementProps} from '../../helpers/React';

export default function CameraControlsComponent({
  upKeys = [38, 87],
  rightKeys = [39, 68],
  downKeys = [40, 83],
  leftKeys = [37, 65],
  fastKeys = [16],
  zoomInKeys = [34],
  zoomOutKeys = [33],
  scrollSpeed = 3,
  fastScrollSpeed = 10,
  zoomSpeed = 1.01,
  wheelZoomSpeed = 1.25
} = {}) {
  return (PresentationalComponent) => {
    const Component = compose(
      connect((state) => {
        return {
          tick: state.ui.tick
        };
      }, {}),
      WithStateHandlersComponent(({x, y, zoom}) => ({
        x,
        y,
        zoom,
        isMouseDragging: false,
        mouseDragStartX: null,
        mouseDragStartY: null,
        mouseDragDeltaX: 0,
        mouseDragDeltaY: 0,
        updateCameraFromInput: makeInputHandler(upKeys, rightKeys, downKeys, leftKeys, fastKeys, zoomInKeys, zoomOutKeys, scrollSpeed, fastScrollSpeed, zoomSpeed)
      }), {
        setZoom: () => (zoom) => ({zoom}),
        startMouseDrag: () => (x, y) => ({
          isMouseDragging: true,
          mouseDragStartX: x,
          mouseDragStartY: y
        }),
        doMouseDrag: ({mouseDragStartX, mouseDragStartY, zoom, x, y}) => (currentMouseDragX, currentMouseDragY) => ({
          x: x + ((currentMouseDragX - mouseDragStartX) / zoom),
          y: y + ((currentMouseDragY - mouseDragStartY) / zoom),
          mouseDragStartX: currentMouseDragX,
          mouseDragStartY: currentMouseDragY
        }),
        endMouseDrag: () => () => ({isMouseDragging: false, mouseDragStartX: null, mouseDragStartY: null, mouseDragDeltaX: 0, mouseDragDeltaY: 0}),
        doMouseWheel: ({x, y, zoom}, {width, height}) => (mouseX, mouseY, wheelDelta) => {
          const zoomMode = wheelDelta < 0 ? wheelZoomSpeed : (1/wheelZoomSpeed);
          const newZoom = zoom * zoomMode;

          const cx = mouseX - (width / 2);
          const cy = mouseY - (height / 2);

          const dx1 = cx / zoom;
          const dy1 = cy / zoom;
          const dx2 = cx / newZoom;
          const dy2 = cy / newZoom;

          return {
            zoom: newZoom,
            x: x + dx2 - dx1,
            y: y + dy2 - dy1,
          };
        }
      }, {
        withPropsOnChange: [
          ['tick'],
          ({keyboard, updateCameraFromInput, x, y, zoom}) => {
            return updateCameraFromInput(keyboard, x, y, zoom);
          }
        ],
        mapProps: ({
          setZoom, keyboard, updateCameraFromInput,
          mouseDragStartX, mouseDragStartY, mouseDragDeltaX, mouseDragDeltaY, isMouseDragging,
          startMouseDrag, doMouseDrag, endMouseDrag, doMouseWheel,
          elementProps, tick, ...props
        }) => {
          return {
            ...props,
            elementProps: mergeElementProps(
              elementProps,
              {
                onMouseDown: (e) => {
                  startMouseDrag(e.clientX, e.clientY);
                },
                onMouseMove: isMouseDragging ? (e) => {
                  doMouseDrag(e.clientX, e.clientY);
                } : null,
                onMouseUp: isMouseDragging ? endMouseDrag : null,
                onWheel: (e) => {
                  doMouseWheel(e.clientX, e.clientY, e.deltaY);
                }
              }
            )
          };
        }
      })
    )(PresentationalComponent);

    Component.displayName = `CameraControlsComponent(${getDisplayName(PresentationalComponent)})`;

    return KeyboardInputComponent()(Component);
  };
}

function makeInputHandler(upKeys, rightKeys, downKeys, leftKeys, fastKeys, zoomInKeys, zoomOutKeys, scrollSpeed, fastScrollSpeed, zoomSpeed) {
  return (keyboard, x, y, zoom) => {
    const isFast = isActive(fastKeys, keyboard);
    const speed = (isFast ? fastScrollSpeed : scrollSpeed ) / zoom;

    if(isActive(zoomInKeys, keyboard)) {
      zoom /= zoomSpeed;
    }

    if(isActive(zoomOutKeys, keyboard)) {
      zoom *= zoomSpeed;
    }

    if(isActive(upKeys, keyboard)) {
      y += speed;
    }

    if(isActive(rightKeys, keyboard)) {
      x -= speed;
    }

    if(isActive(downKeys, keyboard)) {
      y -= speed;
    }

    if(isActive(leftKeys, keyboard)) {
      x += speed;
    }

    return {
      x,
      y,
      zoom
    };
  }
}

function isActive(keys, keyboard) {
  return keys.some(keyCode => (!!keyboard[keyCode]));
}
