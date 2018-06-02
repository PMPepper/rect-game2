console.log('reducer/game/factionSystem');

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

export const ADD_SYSTEM_TO_FACTION = 'factionSystem/ADD_SYSTEM_TO_FACTION';


/////////////////
// Actions     //
/////////////////

export function addSystemToFaction(systemId, factionId, data) {
  return {
    type: ADD_SYSTEM_TO_FACTION,
    systemId: systemId.toString(),
    factionId: factionId.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default joinReducer('system', 'faction', {
  add: [ADD_SYSTEM_TO_FACTION]
})


////////////////
// Helpers    //
////////////////
