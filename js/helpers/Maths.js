//Mathematical methods
export function roundTo(n, decimalPlaces) {
  const mag = Math.pow(10, decimalPlaces);

  return Math.round(n * mag)/mag;
}

export function floorTo(n, decimalPlaces) {
  const mag = Math.pow(10, decimalPlaces);

  return Math.floor(n * mag)/mag;
}

export function ceilTo(n, decimalPlaces) {
  const mag = Math.pow(10, decimalPlaces);

  return Math.ceil(n * mag)/mag;
}


//Geometry
export function volumeOfSphere(radius) {
  return (4/3)*Math.PI*Math.pow(radius, 3);
}


export function distanceBetweenTwoPoints(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return Math.sqrt((dx*dx)+(dy*dy));
}

//rng
export function random(a, b, pow = null, base = 10) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  let num = min + ((max - min) * Math.random());

  if(pow === null) {
    return num;
  }

  const p = Math.pow(base, pow);

  return Math.floor(num * p) / p;
}
