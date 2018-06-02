import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//Apply easing to camera position

//HOCs
import WithStateHandlersComponent from './WithStateHandlersComponent';

const INITIAL_ZOOM = 1/1000000000;
const MAX_ZOOM = 1/100000;
const MIN_ZOOM = 1/100000000000;

export default function CameraEasingComponent({
  easeFactor = 1/15,
  zoomEaseFactor = 1/15,
  zoomSpeed = 1.5,
  maxZoom = MAX_ZOOM,
  minZoom = MIN_ZOOM,
  initialCX = 0.5,
  initialCY = 0.5
} = {}) {
  return (PresentationalComponent) => {
    return compose(
      connect((state) => {
        return {
          tick: state.ui.tick
        };
      }, {}),
      WithStateHandlersComponent(({x, y, zoom}) => ({
        realX: x,
        realY: y,
        realZoom: zoom,
        cx: initialCX,
        cy: initialCY
      }), {

      }, {
        withPropsOnChange: [
          ['tick'],
          ({x, y, zoom, realX, realY, realZoom}) => {
            return {
              realX: applyEasing(realX, x, 1, easeFactor),
              realY: applyEasing(realY, y, 1, easeFactor),
              realZoom: applyEasing(realZoom, zoom, 1/10000000000000, zoomEaseFactor)
            };
          }
        ],
        mapProps: ({realX, realY, realZoom, tick, ...rest}) => {
          return {
            ...rest,
            x: realX,
            y: realY,
            zoom: realZoom
          };
        }
      })
    )(PresentationalComponent);
  };
}

function applyEasing(val, targetVal, threshold, easeFactor) {
  let result = val + ((targetVal - val) * easeFactor);

  if(Math.abs(result - targetVal) < threshold) {
    return targetVal;
  }

  return result;
}
