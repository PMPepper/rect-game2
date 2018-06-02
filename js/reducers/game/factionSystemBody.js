console.log('reducer/game/factionSystemBody');

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

export const ADD_SYSTEM_BODY_TO_FACTION = 'factionSystemBody/ADD_SYSTEM_BODY_TO_FACTION';


/////////////////
// Actions     //
/////////////////

export function addSystemBodyToFaction(systemBodyId, factionId, data) {
  return {
    type: ADD_SYSTEM_BODY_TO_FACTION,
    systemBodyId: systemBodyId.toString(),
    factionId: factionId.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default joinReducer('systemBody', 'faction', {
  add: [ADD_SYSTEM_BODY_TO_FACTION]
})


////////////////
// Helpers    //
////////////////
