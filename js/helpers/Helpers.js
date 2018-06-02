//Misc helper methods
export function passthrough(val) {
  return val;
}


export function combineFunctions(...funcs) {
  return function (...args) {
    for(let i = 0; i < funcs.length; i++) {
      funcs[i].apply(this, args);//Is this context ok?
    }
  }
}
