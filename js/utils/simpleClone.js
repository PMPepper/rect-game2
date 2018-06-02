export default function simpleClone(val) {
  switch(typeof(val)) {
    case 'string':
      return val + '';
    case 'number':
      return +val;
    case 'boolean':
      return !!val;
    case 'undefined':
      return undefined;
    case 'object'://TODO deal with arrays?
      return val === null ? null : {...val};
    case 'function':
    case 'symbol':
    default:
      return val;//won't be cloned

  }
}
