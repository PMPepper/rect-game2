import asteroids from './data/raw-sol-asteroids.json';

import SystemBodyTypes from './consts/SystemBodyTypes';
import OrbitTypes from './consts/OrbitTypes';

const DEG_TO_PI = Math.PI / 180;

const importedAsteroids = asteroids.sort((a, b) => (b.diameter - a.diameter)).slice(0, 150).map(raw => {
  const asteroid = {
    name: parseName(raw),
    parent: 'Sol A',
    type: SystemBodyTypes.ASTEROID,
    mass: getMass(raw),
    radius: Math.round(raw.diameter * 500),
    diameter: Math.round(raw.diameter * 1000),
    day: Math.round(raw.rot_per * 3600),
    axialTilt: raw.i * DEG_TO_PI,
    tidalLock: false,
    albedo: raw.albedo,
    orbit: {
      type: OrbitTypes.REGULAR,
      radius: getOrbitRadius(raw),
      offset: Math.random()//TODO get real offset
    },
  };

  return asteroid;
});


const GMtoKg = 14.52604450454495 * Math.pow(10, 18)

function getMass(raw) {
  if(raw.mass) {
    return raw.mass * Math.pow(10, 18);
  }

  if(raw.GM) {
    return parseFloat(raw.GM) * GMtoKg;
  }

  //TODO what now??
  return 1;
}

import {GRAVITATIONAL_CONSTANT} from './consts/Physics';
import {YEAR} from './consts/Metrics';

function radiusOfOrbit(mass1, mass2, period) {
  return Math.pow(
    (period * period * GRAVITATIONAL_CONSTANT * (mass1 + mass2)) / (4 * Math.PI * Math.PI),
    1/3
  );
}

function getOrbitRadius(raw) {
  const asteroidMass = getMass(raw);
  const solAMass = 1.9891e30;

  return radiusOfOrbit(asteroidMass, solAMass, raw.per_y * YEAR);
}

function parseName(raw) {
  const parts = raw.full_name.split(' ');
  parts.shift();
  return parts.join(' ');
}


export default importedAsteroids;
