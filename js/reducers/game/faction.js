console.log('reducer/game/faction');

//////////////////
// Imports      //
//////////////////

import {ADD_FACTION} from './factions';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  factionId: null,
  name: null
};


//////////////////
// Action types //
//////////////////




/////////////////
// Actions     //
/////////////////




////////////////
// Reducer/s  //
////////////////

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_FACTION:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
