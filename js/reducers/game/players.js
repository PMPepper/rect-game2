console.log('reducer/game/players');

//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import player, {DEFAULT_STATE as DEFAULT_PLAYER_STATE, ADD_PLAYER} from './player';


//////////////////
// Default      //
//////////////////



//////////////////
// Action types //
//////////////////




/////////////////
// Actions     //
/////////////////

export function addPlayer(id, data) {
  return {
    type: ADD_PLAYER,
    id: id.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_PLAYER_STATE, player, {
  idProp: 'id',
  edit: [ADD_PLAYER]
});


////////////////
// Helpers    //
////////////////
