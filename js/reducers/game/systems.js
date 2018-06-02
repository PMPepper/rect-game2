console.log('reducer/game/systems');

//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import system, {DEFAULT_STATE as DEFAULT_SYSTEM_STATE, ADD_SYSTEM} from './system';


//////////////////
// Default      //
//////////////////



//////////////////
// Action types //
//////////////////




/////////////////
// Actions     //
/////////////////

export function addSystem(id, data) {
  return {
    type: ADD_SYSTEM,
    id: id.toString(),
    ...data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_SYSTEM_STATE, system, {
  idProp: 'id',
  edit: [ADD_SYSTEM]
});


////////////////
// Helpers    //
////////////////
