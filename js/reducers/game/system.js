console.log('reducer/game/system');

//////////////////
// Imports      //
//////////////////



//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  primary: null,
};


//////////////////
// Action types //
//////////////////

export const ADD_SYSTEM = 'systems/ADD_SYSTEM';


/////////////////
// Actions     //
/////////////////




////////////////
// Reducer/s  //
////////////////

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_SYSTEM:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
