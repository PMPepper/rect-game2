//////////////////
// Imports      //
//////////////////




//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

export const KEY_DOWN = 'keyboard/KEY_DOWN';
export const KEY_UP = 'keyboard/KEY_UP';


/////////////////
// Actions     //
/////////////////

export function keyDown(keyCode) {
  return {
    type: KEY_DOWN,
    keyCode
  }
}

export function keyUp(keyCode) {
  return {
    type: KEY_UP,
    keyCode
  }
}


////////////////
// Reducer/s  //
////////////////

export default function (state = DEFAULT_STATE, action) {
  switch(action.type) {
    case KEY_DOWN:
      if(state[action.keyCode]) {
        return state;
      }
      
      return {
        ...state,
        [action.keyCode]: true
      }
    case KEY_UP:
      if(!state[action.keyCode]) {
        return state;
      }

      return {
        ...state,
        [action.keyCode]: false
      }
  }

  return state;
}


////////////////
// Helpers    //
////////////////
