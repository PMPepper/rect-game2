console.log('reducer/game/factionPlayer');

//////////////////
// Imports      //
//////////////////

import {joinReducer} from '../../helpers/Redux';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

export const ADD_PLAYER_TO_FACTION = 'factionPlayer/ADD_PLAYER_TO_FACTION';


/////////////////
// Actions     //
/////////////////

export function addPlayerToFaction(playerId, factionId, role) {
  return {
    type: ADD_PLAYER_TO_FACTION,
    playerId: playerId.toString(),
    factionId: factionId.toString(),
    role
  };
}


////////////////
// Reducer/s  //
////////////////

export default joinReducer('faction', 'player', {
  add: [ADD_PLAYER_TO_FACTION],
  dataProp: 'role'
})


////////////////
// Helpers    //
////////////////
