import {keyDown, keyUp} from '../reducers/keyboard';

function onKeyDown(e) {
  store.dispatch(keyDown(e.keyCode));
}

function onKeyUp(e) {
  store.dispatch(keyUp(e.keyCode));
}

let store = null;
let element = null;

export default function keyboardReduxActions(aElement, aStore) {
  element = aElement;
  store = aStore;

  element.addEventListener('keydown', onKeyDown);
  element.addEventListener('keyup', onKeyUp);
}

export function tidyUp() {
  element.removeEventListener('keydown', onKeyDown);
  element.removeEventListener('keyup', onKeyUp);

  element = null;
}
