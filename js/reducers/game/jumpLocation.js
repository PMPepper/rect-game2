console.log('reducer/game/jumpLocation');

//////////////////
// Imports      //
//////////////////




//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  jumpLocationId: null,
  isJumpPoint: false,
  destinationSystemId: null,
  destinationJumpId: null,
  x: 0,
  y: 0
};


//////////////////
// Action types //
//////////////////

export const ADD_JUMP_LOCATION = 'jumpLocation/ADD_JUMP_LOCATION';


/////////////////
// Actions     //
/////////////////




////////////////
// Reducer/s  //
////////////////

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_JUMP_LOCATION:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
