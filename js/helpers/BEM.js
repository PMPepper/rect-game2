const elementSep = '-';
const modifierSep = '_';

export function getClassName(baseClassName, modifiers = null) {
  if(baseClassName instanceof Array) {
    baseClassName = baseClassName.join(elementSep);
  }

  let className = baseClassName;

  if(modifiers) {
    for(let mod in modifiers) {
      let modifierClassName = makeModifierClass(baseClassName, mod, modifiers[mod]);

      if(modifierClassName) {
        className += ' '+modifierClassName;
      }
    }
  }

  return className;
}

export function makeModifierClass(baseClassName, modifierName, modifierValue) {
  if(modifierValue === undefined || modifierValue === false) {
    return null;
  }

  return baseClassName+modifierSep+modifierName+(modifierValue === null ? '' : modifierSep+modifierValue);
}

export function getElementSeparator() {
  return elementSep;
}

export function getModifierSeparator() {
  return modifierSep;
}
