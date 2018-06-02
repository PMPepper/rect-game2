import React from 'react';

import OrbitTypes from '../../consts/OrbitTypes';
import SystemBodyTypes from '../../consts/SystemBodyTypes';

import {systemBodiesOfTypeInSystem} from '../../helpers/App';
import {mergeClassName} from '../../helpers/React';


export default function SystemRenderer({onSystemBodiesClicked, ...props}) {
  const onScreenSystemBodyPositions = render(props);

  const {
    element, style, systemId, systemBodies, factionSystemBodies, zoom, x, y,
    width, height, cx, cy, bgImg,
    isClickPrevented, isClickStarted,
    elementProps
  } = props;

  return <canvas
    {...elementProps}
    onClick={null}//prevent 'real' click handler
    className={mergeClassName('systemRenderer', elementProps.className)}
    width={width}
    height={height}
    onMouseUp={(e) => {
      if(isClickStarted && !isClickPrevented) {
        elementProps.onClick && elementProps.onClick(e, onScreenSystemBodyPositions);
      }

      elementProps.onMouseUp && elementProps.onMouseUp(e);
    }}
  ></canvas>
}

//constants
const defaultBGImg = new window.Image();
defaultBGImg.src = '../images/bg.png';
defaultBGImg.onload = (e) => {
  //record that this is loaded
}

//-styles
const orbitStyle = {
  radius: null,
  fillColour: null,
  edgeColour: 0x66FFFFFF,
  edgeThickness: 0.8,
  edgeStyle: null
};

const starStyle = {
  radius: 7,
  fillColour: 0xFFFDFF00
};
const planetStyle = {
  radius: 5,
  fillColour: 0xFF3333FF
};

const gasGiantStyle = {
  radius: 6,
  fillColour: 0xFF6666CC
};

const moonStyle = {
  radius: 4,
  fillColour: 0xFF4444FF
};

const asteroidStyle = {
  radius: 2,
  fillColour: 0xFF999999
}


SystemRenderer.defaultProps = {
  cx: 0.5,
  cy: 0.5,
  bgImg: defaultBGImg
};

//helpers

function render(props) {
  const onScreenSystemBodyPositions = [];

  if(!props.element) {
    return onScreenSystemBodyPositions;
  }

  const {element, systemId, systemBodies, zoom, x, y, width, height, cx, cy, bgImg} = props;
  const ctx = element.getContext('2d');

  //Draw background
  var ptrn = ctx.createPattern(bgImg, 'repeat'); // Create a pattern with this image, and set it to "repeat".
  ctx.fillStyle = ptrn;
  ctx.fillRect(0, 0, width, height);

  //get bodies to render
  const bodies = systemBodiesOfTypeInSystem(systemId, null, systemBodies);

  //render bodies
  bodies.forEach(systemBody => {
    const position = systemToScreen(systemBody, props);

    position.systemBody = systemBody;//TODO is this a good idea?

    renderSystemBody(ctx, systemBody, position, props);

    if(position.x >= 0 && position.x <= width && position.y >= 0 && position.y <= height) {//TODO is on screen
      onScreenSystemBodyPositions.push(position);
    }
  });

  return onScreenSystemBodyPositions;
}

function renderSystemBody(ctx, systemBody, position, props) {
  const {zoom, systemBodies, factionSystemBodies} = props;
  const minBodyOrbitRenderSize = 5;//TODO config?

  //If orbit is too small don't render anything
  if(systemBody.orbit && (systemBody.orbit.radius*zoom < minBodyOrbitRenderSize)) {
    return;
  }

  if(!factionSystemBodies || !factionSystemBodies[systemBody.id]) {
    return;
  }

  //Render the system bodies orbit (if applicable)
  systemBody.orbit && systemBody.type !== SystemBodyTypes.ASTEROID && renderOrbit(ctx, systemBody, systemToScreen(systemBodies[systemBody.parentId], props), props);

  switch(systemBody.type) {
    case SystemBodyTypes.STAR:
      renderCircle(ctx, position, starStyle, systemBody.radius * zoom, factionSystemBodies[systemBody.id].name, true);
      break;
    case SystemBodyTypes.MOON:
      renderCircle(ctx, position, moonStyle, systemBody.radius * zoom, factionSystemBodies[systemBody.id].name, true);
      break;
    case SystemBodyTypes.GAS_GIANT:
      renderCircle(ctx, position, gasGiantStyle, systemBody.radius * zoom, factionSystemBodies[systemBody.id].name, true);
      break;
    case SystemBodyTypes.PLANET:
      renderCircle(ctx, position, planetStyle, systemBody.radius * zoom, factionSystemBodies[systemBody.id].name, true);
      break;
    case SystemBodyTypes.ASTEROID:
      renderCircle(ctx, position, asteroidStyle, systemBody.radius * zoom, factionSystemBodies[systemBody.id].name, true);
      break;
    default:
      debugger;
  }
}

function renderOrbit(ctx, systemBody, parentSystemBodyPosition, props) {
  const orbit = systemBody.orbit;
  const {zoom} = props;

  switch(orbit.type) {
    case OrbitTypes.REGULAR:
      renderCircle(ctx, parentSystemBodyPosition, orbitStyle, orbit.radius * zoom);
      return;

  }
}

//drawing functions
function renderCircle(ctx, position, style, minRadius, label = null, assignRadiusToPosition = false) {
  const hasStroke = style.edgeThickness > 0;
  const hasFill = getColourAlpha(style.fillColour) !== 0;
  const radius = Math.max(style.radius, minRadius);

  if(assignRadiusToPosition) {
    position.radius = radius;
  }

  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, Math.PI*2, false);

  if(hasFill) {
    ctx.fillStyle = colourToCss(style.fillColour);
    ctx.fill();
  }

  if(hasStroke) {
    ctx.strokeStyle = colourToCss(style.edgeColour);
    ctx.lineWidth = style.edgeThickness;
    ctx.stroke();
  }

  //label
  const minLabelThreshold = 0.00002;
  const fadeLabelThreshold = 0.0002;

  if(label && minRadius > minLabelThreshold) {
    const alpha = Math.min(Math.max(0,
      (minRadius - minLabelThreshold) / (fadeLabelThreshold - minLabelThreshold)
    ), 1);
    ctx.save();

    ctx.font = '11px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;

    ctx.shadowColor = '#000';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 3;

    ctx.fillText(label, position.x, position.y + radius + 15);

    //Thicken shadow
    //ctx.fillStyle = 'rbga(0, 0, 0, 0)';
    //ctx.fillText(label, position.x, position.y + radius + 15);

    ctx.restore();
  }
};


function colourToCss(colour) {
  const a = getColourAlpha(colour);
  const r = (colour & 0x00FF0000) >> 16;
  const g = (colour & 0x0000FF00) >> 8;
  const b = (colour & 0x000000FF);

  return `rgba(${r},${g},${b},${a})`;
}

function getColourAlpha(colour) {
  return ((colour >> 24) & 0xFF)/0xFF;
}

//coords based helpers
function systemToScreen(coords, {x, y, cx, cy, width, height, zoom}) {
  return {
    x: ((x - coords.x) * zoom) + (width*cx),
    y: ((y - coords.y) * zoom) + (height*cy)
  };
}

function screenToSystem(coords, {x, y, cx, cy, width, height, zoom}) {
  return {
    x: ((coords.x - (cx * width)) / zoom) + x,
    y: ((coords.y - (cy * height)) / zoom) + y
  }
}
