console.log('reducer/game/jumpLocations');

//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import jumpLocation, {DEFAULT_STATE as DEFAULT_JUMP_LOCATION_STATE, ADD_JUMP_LOCATION} from './jumpLocation';


//////////////////
// Default      //
//////////////////

const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////




/////////////////
// Actions     //
/////////////////

export function addJumpLocation(id, data) {
  return {
    type: ADD_JUMP_LOCATION,
    id: id.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_JUMP_LOCATION_STATE, jumpLocation, {
  idProp: 'id',
  edit: [ADD_JUMP_LOCATION]
});


////////////////
// Helpers    //
////////////////
