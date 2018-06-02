import OrbitTypes from '../consts/OrbitTypes';
import SystemBodyTypes from '../consts/SystemBodyTypes';

import {distanceBetweenTwoPoints} from './Maths';
import {surfaceHeating} from './Physics';


//orbit methods
const ORIGIN = {x: 0, y: 0};

export function systemBodyPositionAtTime(systemBody, time, systemBodies) {
  if(!systemBody.orbit) {
    return ORIGIN;
  }

  switch(systemBody.orbit.type) {
    case OrbitTypes.REGULAR:
      return regularOrbitSystemBodyPositionAtTime(systemBody, time, systemBodies)
  }
}

export function regularOrbitSystemBodyPositionAtTime(systemBody, time, systemBodies) {
  const parent = systemBody.parentId ? systemBodies[systemBody.parentId] : null;
  const orbit = systemBody.orbit;

  if(!parent || !orbit) {
    return ORIGIN;
  }

  const orbitRadius = orbit.radius;
  const parentCoord = systemBodyPositionAtTime(parent, time, systemBodies);
  const orbitAngle = regularOrbitAngleAtTime(orbit, time);

  return {
    x: parentCoord.x + (orbitRadius * Math.cos(orbitAngle)),
    y: parentCoord.y + (orbitRadius * Math.sin(orbitAngle))
  };
}

function regularOrbitAngleAtTime(orbit, time) {
  const orbitalPeriod = orbit.period;

  time += orbitalPeriod * orbit.offset;

  const orbitFraction = (time % orbitalPeriod)/orbitalPeriod;

  return orbitFraction * Math.PI * 2;
}

export function systemBodiesDistanceAtTime(body1, body2, time, systemBodies) {
  const pos1 = systemBodyPositionAtTime(body1, time, systemBodies);
  const pos2 = systemBodyPositionAtTime(body2, time, systemBodies);

  return distanceBetweenTwoPoints(pos1, pos2);
}

export function maxSystemBodyDistance(body1, body2, systemBodies) {
  const ancestors = getSystemBodiesFirstCommonAncestor(body1, body2, systemBodies);
  let i = 0;

  let distance = 0;

  for(i = ancestors.ancestorPos+1; i < ancestors.body1Ancestors.length; i++) {
    distance += ancestors.body1Ancestors[i].orbit.maxRadius;
  }

  for(i = ancestors.ancestorPos+1; i < ancestors.body2Ancestors.length; i++) {
    distance += ancestors.body2Ancestors[i].orbit.maxRadius;
  }

  return distance;
}

export function minSystemBodyDistance(body1, body2, systemBodies) {
  const ancestors = getSystemBodiesFirstCommonAncestor(body1, body2, systemBodies);
  const distances = [];

  for(let i = ancestors.ancestorPos+1; i < ancestors.body1Ancestors.length; i++) {
    let curAncestor = ancestors.body1Ancestors[i];

    distances.push({
      //name: curAncestor.id +'-'+curAncestor.parent.name,
      min: curAncestor.orbit.minRadius,
      max: curAncestor.orbit.maxRadius
    });
  }

  for(let i = ancestors.ancestorPos+1; i < ancestors.body2Ancestors.length; i++) {
    let curAncestor = ancestors.body2Ancestors[i];

    distances.push({
      //name: curAncestor.id +'-'+curAncestor.parent.name,
      min: curAncestor.orbit.minRadius,
      max: curAncestor.orbit.maxRadius
    });
  }

  distances.sort((a, b) => {
    return b.min - a.min;
  });

  let largestReduction = 0;

  for( let i = 1; i < distances.length; i++) {
    largestReduction += distances[i].max;
  }

  if(largestReduction > distances[0].min) {
    //I don't think this can happen in a real solar system, so not worrying about writing code to make it work
    console.log(`TODO improve min distance calculation, this pair of systems is not being calculated properly: ${body1.name} - ${body2.name}`);
    debugger;
    return Math.abs(largestReduction - distances[0].min);
  }

  return distances[0].min - largestReduction;
}

export function avgSystemBodyDistance(body1, body2, systemBodies) {
  return (minSystemBodyDistance(body1, body2, systemBodies) + maxSystemBodyDistance(body1, body2, systemBodies))/2;
}


//ancestor methods
export function getSystemBodiesFirstCommonAncestor(body1, body2, systemBodies) {


  const body1Ancestors = systemBodyAncestors(body1, systemBodies);
  const body2Ancestors = systemBodyAncestors(body2, systemBodies);
  let commonAncestor = null;

  body1Ancestors.unshift(body1);
  body2Ancestors.unshift(body2);

  //reverse so star is first
  body1Ancestors.reverse();
  body2Ancestors.reverse();

  if(body1Ancestors[0] !== body2Ancestors[0]) {
    return null;//they are not in the same system
  }

  const minLength = Math.min(body1Ancestors.length, body2Ancestors.length);

  //work through list until you stop finding matches
  let i = 0;

  for(i = 0; i < minLength; i++) {
    if(body1Ancestors[i] != body2Ancestors[i]) {
      commonAncestor = body2Ancestors[i-1];//the previous body is the last common body
      break;
    }
  }

  return {
    body1Ancestors: body1Ancestors,
    body2Ancestors: body2Ancestors,
    ancestorPos: i-1,
    commonAncestor: commonAncestor
  };
}

export function systemBodyAncestors(systemBody, systemBodies) {
  const ancestors = [];
  let curSystemBody = systemBody;

  while(curSystemBody && curSystemBody.parentId && (curSystemBody = systemBodies[curSystemBody.parentId])) {
    ancestors.push(curSystemBody);
  }

  return ancestors;
}

//Heating
export function systemBodySurfaceTemperature(systemBody, systemBodies) {
  if(systemBody.type === SystemBodyTypes.STAR) {
    return 2000;//TODO actual real surface temp?
  } else {
    //TODO include atmosphere
    return totalSurfaceHeating(systemBody, systemBodies);
  }
}

//doesn't make sense for stars
export function totalSurfaceHeating(systemBody, systemBodies) {
  const albedo = systemBody.albedo;
  const stars = systemBodiesOfTypeInSystem(systemBody.systemId, SystemBodyTypes.STAR, systemBodies)

  let heating = 0;

  Object.values(stars).forEach((star) => {
    heating += surfaceHeating(star.luminosity, albedo, distanceBetweenTwoPoints(systemBody, star));
  });

  return Math.pow(heating, 0.25);
}

export function minSurfaceHeating (systemBody, stars, systemBodies) {
  const albedo = systemBody.albedo;

  let heating = 0;

  stars.forEach((star) => {
    heating += surfaceHeating(star.luminosity, albedo, minSystemBodyDistance(systemBody, star, systemBodies));
  });

  return Math.pow(heating, 0.25);
}

export function maxSurfaceHeating (systemBody, stars, systemBodies) {
  const albedo = systemBody.albedo;

  let heating = 0;

  stars.forEach((star) => {
    heating += surfaceHeating(star.luminosity, albedo, maxSystemBodyDistance(systemBody, star, systemBodies));
  });

  return Math.pow(heating, 0.25);
}

export function avgSurfaceHeating (systemBody, stars, systemBodies) {
  return (minSurfaceHeating(systemBody, stars, systemBodies) + maxSurfaceHeating(systemBody, stars, systemBodies))/2;
}

//get an array of system bodies of specified type in a system
export function systemBodiesOfTypeInSystem(systemId, systemBodyType, systemBodies) {
  const arr = [];
  let body = null;

  for(let i = 0, bodies = Object.values(systemBodies); i < bodies.length; i++) {
    body = bodies[i];

    if(body.systemId === systemId && (!systemBodyType || body.type === systemBodyType)) {
      arr.push(body);
    }
  }

  return arr;
}
