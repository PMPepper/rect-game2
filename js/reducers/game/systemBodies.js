console.log('reducer/game/systemBodies');

//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import systemBody, {DEFAULT_STATE as DEFAULT_SYSTEM_BODY_STATE, ADD_SYSTEM_BODY} from './systemBody';


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

export function addSystemBody(id, data) {
  return {
    type: ADD_SYSTEM_BODY,
    id: id.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_SYSTEM_BODY_STATE, systemBody, {
  idProp: 'id',
  edit: [ADD_SYSTEM_BODY]
});

////////////////
// Helpers    //
////////////////
