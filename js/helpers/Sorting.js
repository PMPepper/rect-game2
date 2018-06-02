import {resolveObjPath} from './Object';

export const ALPHABETICAL = 'alphabetical';
export const NUMERIC = 'numeric';
export const DATE = 'date';

export function sortAlphabeticalOnProp(prop, locales = undefined, desc = false) {
  let collator = (locales instanceof Intl.Collator) ? locales : new Intl.Collator(locales, {numeric: true, sensitivity: 'base'});

  return desc ? (a, b) => {
    return collator.compare(b[prop], a[prop]);
  }
  :
  (a, b) => {
    return collator.compare(a[prop], b[prop]);
  }
}

export function sortAlphabeticalOnObjPath(path, locales = undefined, desc = false) {
  let collator = (locales instanceof Intl.Collator) ? locales : new Intl.Collator(locales, {numeric: true, sensitivity: 'base'});

  return desc ? (a, b) => {
    return collator.compare(resolveObjPath(b, path), resolveObjPath(a, path));
  }
  :
  (a, b) => {
    return collator.compare(resolveObjPath(a, path), resolveObjPath(b, path));
  }
}

export function sortArrAlphabeticalOnProp(arr, prop, locales = undefined, desc = false) {
  arr.sort(sortAlphabeticalOnProp(prop, locales, desc));

  return arr;
}

export function sortNumericOnProp(prop, desc = false) {
  return desc ? (a, b) => {
    return b[prop] - a[prop];
  }
  :
  (a, b) => {
    return a[prop] - b[prop];
  }
}

export function sortNumericOnObjPath(path, desc = false) {
  return desc ? (a, b) => {
    return resolveObjPath(b, path) - resolveObjPath(a, path);
  }
  :
  (a, b) => {
    return resolveObjPath(a, path) - resolveObjPath(b, path);
  }
}

export function sortDateOnProp(prop, desc = false) {
  return desc ? (a, b) => {
    return (((a[prop] instanceof Date) ? a[prop] : new Date(a[prop])) < ((b[prop] instanceof Date) ? b[prop] : new Date(b[prop]))) ? 1 : -1;
  }
  :
  (a, b) => {
    return (((a[prop] instanceof Date) ? a[prop] : new Date(a[prop])) > ((b[prop] instanceof Date) ? b[prop] : new Date(b[prop]))) ? 1 : -1;
  }
}

export function sortDateOnObjPath(path, desc = false) {
  return desc ? (a, b) => {
    const aVal = resolveObjPath(a, path);
    const bVal = resolveObjPath(b, path);

    return (((aVal instanceof Date) ? aVal : new Date(aVal)) < ((bVal instanceof Date) ? bVal : new Date(bVal))) ? 1 : -1;
  }
  :
  (a, b) => {
    const aVal = resolveObjPath(a, path);
    const bVal = resolveObjPath(b, path);

    return (((aVal instanceof Date) ? aVal : new Date(aVal)) > ((bVal instanceof Date) ? bVal : new Date(bVal))) ? 1 : -1;
  }
}

export function sortAlphabetical(locales = undefined, desc = false) {
  let collator = (locales instanceof Intl.Collator) ? locales : new Intl.Collator(locales, {numeric: true, sensitivity: 'base'});

  return desc ? (a, b) => {
    return collator.compare(b, a);
  }
  :
  (a, b) => {
    return collator.compare(a, b);
  }
}

export function sortArrAlphabetical(arr, locales = undefined, desc = false) {
  arr.sort(sortAlphabetical(locales, desc));

  return arr;
}

export function sortNumeric(arr, desc = false) {
  arr.sort(desc ? (a,b) => ((+b)-(+a)) : (a,b) => ((+a)-(+b)))

  return arr;
}

export function sortDate(prop, desc = false) {
  return desc ? (a, b) => {
    return a > b ? 1 : 2;
  }
  :
  (a, b) => {
    return a < b;
  }
}

export function valuesSortedByNumericKeys(obj, desc=false) {
  return sortNumeric(Object.keys(obj).filter((key) => (!isNaN(+key))), desc).map((key)=>obj[key]);
}
