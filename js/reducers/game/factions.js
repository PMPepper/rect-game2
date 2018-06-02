console.log('reducer/game/factions');

//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import faction, {DEFAULT_STATE as DEFAULT_FACTION_STATE} from './faction';


//////////////////
// Default      //
//////////////////



//////////////////
// Action types //
//////////////////

export const ADD_FACTION = 'factions/ADD_FACTION';


/////////////////
// Actions     //
/////////////////

export function addFaction(id, data) {
  return {
    type: ADD_FACTION,
    id: id.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_FACTION_STATE, faction, {
  idProp: 'id',
  edit: [ADD_FACTION]
});


////////////////
// Helpers    //
////////////////
