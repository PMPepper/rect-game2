//////////////////
// Imports      //
//////////////////



//////////////////
// Default      //
//////////////////

const DEFAULT_STATE = {culture: null, strings: {}};


//////////////////
// Action types //
//////////////////

const SET_CULTURE = 'localisation/SET_CULTURE';


/////////////////
// Actions     //
/////////////////

export function setCulture(culture, strings) {
  return {type: SET_CULTURE, culture, strings};
}


////////////////
// Reducer/s  //
////////////////

export default function localisation(state = DEFAULT_STATE, action) {
  if(action.type === SET_CULTURE) {
    return {culture: action.culture, strings: action.strings};
  }


  return state;
}


////////////////
// Helpers    //
////////////////
