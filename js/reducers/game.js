console.log('reducer/game');

//////////////////
// Imports      //
//////////////////

import {combineReducers} from 'redux';

import {updateSystemBodyPosition, updateSystemBodyEnvironment} from './game/systemBody';
import systemBodies from './game/systemBodies';
import jumpLocations from './game/jumpLocations';
import players from './game/players';
import factions from './game/factions';
import factionPlayer from './game/factionPlayer';
import systems from './game/systems';
import factionSystem from './game/factionSystem';
import factionSystemBody from './game/factionSystemBody';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

export const SET_TIME = 'game/SET_TIME';


/////////////////
// Actions     //
/////////////////

export function setTime(time) {
  return (dispatch, getState) => {
    dispatch(_setTime(time));
    dispatch(updateSystemBodyPosition(time, getState().game.systemBodies));
    dispatch(updateSystemBodyEnvironment(time, getState().game.systemBodies));
  }
}

export function advanceTime(by) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(setTime(state.game.time + by));
  }
}

function _setTime(time) {
  return {
    type: SET_TIME,
    time
  }
}


////////////////
// Reducer/s  //
////////////////

export default combineReducers({
  jumpLocations,
  players,
  factions,
  factionPlayer,
  systems,
  systemBodies,
  factionSystem,
  factionSystemBody,
  time: (state = 0, action) => {
    if(action.type === SET_TIME) {
      return action.time;
    }

    return state;
  }
});


////////////////
// Helpers    //
////////////////
