//////////////////
// Imports      //
//////////////////

import {combineReducers} from 'redux';
import makeWindowingManagerReducer from './ui/makeWindowingManager';
import makeWindowReducer from './ui/makeWindow';
import makeTabsReducer from './ui/makeTabs';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  factionId: null,
  tick: 0
};


//////////////////
// Action types //
//////////////////

export const SET_CONTROLLED_FACTION = 'ui/SET_CONTROLLED_FACTION';
export const TICK = 'ui/TICK';
export const SET_REQUESTED_GAME_SPEED = 'ui/SET_REQUESTED_GAME_SPEED';
export const SET_ACTUAL_GAME_SPEED = 'ui/SET_ACTUAL_GAME_SPEED';


/////////////////
// Actions     //
/////////////////

export function setControlledFaction(factionId) {
  return {
    type: SET_CONTROLLED_FACTION,
    controlledFactionId: factionId.toString()
  };
}

export function tick() {
  return {
    type: TICK
  }
}

export function setRequestedGameSpeed(gameSpeed) {
  return {
    type: SET_REQUESTED_GAME_SPEED,
    gameSpeed
  }
}


////////////////
// Reducer/s  //
////////////////

export default combineReducers({
  requestedGameSpeed: (state = 0, action) => {
    switch(action.type) {
      case SET_REQUESTED_GAME_SPEED:
        return action.gameSpeed;
    }

    return state;
  },
  actualGameSpeed: (state = 0, action) => {
    switch(action.type) {
      case SET_ACTUAL_GAME_SPEED:
        return action.gameSpeed;
    }

    return state;
  },
  tick: (state = 0, action) => {
    if(action.type === TICK) {
      return state + 1;
    }

    return state;
  },
  controlledFactionId: (state = null, action) => {
    if(action.type === SET_CONTROLLED_FACTION) {
      return action.controlledFactionId;
    }

    return state;
  },
  gameWM: makeWindowingManagerReducer('ui.gameWM'),
  colonyManagement: combineReducers({
    window: makeWindowReducer('ui.colonyManagement.window'),
    tabs: makeTabsReducer('ui.colonyManagement.tabs')
  }),
  systemOverview: combineReducers({
    window: makeWindowReducer('ui.systemOverview.window')
  }),
});


////////////////
// Helpers    //
////////////////
