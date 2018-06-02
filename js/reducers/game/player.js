console.log('reducer/game/player');

//////////////////
// Imports      //
//////////////////



//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  playerId: null,
  name: null
};


//////////////////
// Action types //
//////////////////

export const ADD_PLAYER = 'players/ADD_PLAYER';


/////////////////
// Actions     //
/////////////////




////////////////
// Reducer/s  //
////////////////

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_PLAYER:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
