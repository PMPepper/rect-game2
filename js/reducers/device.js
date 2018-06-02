//////////////////
// Imports      //
//////////////////



//////////////////
// Default      //
//////////////////

const DEFAULT_STATE = {
  pixelRatio: 1
};


//////////////////
// Action types //
//////////////////

const SET_PIXEL_RATIO = 'device/SET_PIXEL_RATIO';


/////////////////
// Actions     //
/////////////////

export function setPixelRatio(pixelRatio) {
  return {type: SET_PIXEL_RATIO, pixelRatio};
}


////////////////
// Reducer/s  //
////////////////

export default function device(state = DEFAULT_STATE, action) {
  if(action.type === SET_PIXEL_RATIO) {
    return {...state, pixelRatio: action.pixelRatio};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
