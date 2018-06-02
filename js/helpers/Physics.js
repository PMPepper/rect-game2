import {STEFAN_BOLTZMANN, GRAVITATIONAL_CONSTANT} from '../consts/Physics';


//gravitational
export function gravityAtDistanceFromMass(mass, distance) {
  return (GRAVITATIONAL_CONSTANT * mass) / (distance * distance);
}

export function escapeVelocity (mass, distance) {
  return Math.sqrt((2*GRAVITATIONAL_CONSTANT*mass)/distance);
}

export function orbitPeriod(orbitRadius, orbitingBody, orbitedBody) {
  if(!orbitingBody || !orbitedBody) {
    return null;
  }

  const a = Math.pow(orbitRadius, 3);
  const b = GRAVITATIONAL_CONSTANT * (orbitingBody.mass + orbitedBody.mass);

  return 2 * Math.PI * Math.sqrt(a/b);
}

//heating

export function surfaceHeating(luminosity, albedo, distance) {
  // L⊙(1−a) / 16πd2ơ
  return (luminosity * (1 - albedo)) / (16 * Math.PI * STEFAN_BOLTZMANN * distance * distance);
}
