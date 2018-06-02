console.log('reducers/server');

//////////////////
// Imports      //
//////////////////

import {combineReducers} from 'redux';

import {ADD_PLAYER} from './game/player';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

export const PLAYER_CONNECTED = 'server/PLAYER_CONNECTED';
export const SET_PLAYER_GAME_SPEED = 'server/SET_PLAYER_GAME_SPEED';


/////////////////
// Actions     //
/////////////////

export function playerConnected(playerId) {
  return {
    type: PLAYER_CONNECTED,
    id: playerId,
    gameSpeed: 0
  };
}

export function setPlayerGameSpeed(playerId, gameSpeed) {
  return (dispatch, getState) => {
    dispatch(_setPlayerGameSpeed(playerId, gameSpeed));


    //get other players game speeds
    const allPlayers = getState().server.players;

    //TODO Find lowest and apply
    console.log('setPlayerGameSpeed: ', allPlayers);
  }
}

function _setPlayerGameSpeed(playerId, gameSpeed) {
  return {
    type: SET_PLAYER_GAME_SPEED,
    id: playerId,
    gameSpeed
  };
}


////////////////
// Reducer/s  //
////////////////

function gameSpeedReducer(state = 0, action) {
  //TODO

  return state;
}

function playersReducer(state = DEFAULT_STATE, action) {
  let player;

  switch(action.type) {
    case ADD_PLAYER:
      return {
        ...state,
        [action.id]: {
          ...action.data,
          id: action.id,
          isConnected: false,
          gameSpeed: action.gameSpeed,
          connectionData: null
        }
      };
    case PLAYER_CONNECTED:
      player = state[action.id];

      if(!player) {
        return state;
      }

      return {
        ...state,
        [action.id]: {
          ...player,
          isConnected: true
        }
      }
    case SET_PLAYER_GAME_SPEED:
      player = state[action.id];

      if(!player) {
        return state;
      }

      return {
        ...state,
        [action.id]: {
          ...player,
          gameSpeed: action.gameSpeed
        }
      }
  }


  return state;
}

export default combineReducers({
  gameSpeed: gameSpeedReducer,
  players: playersReducer
});

////////////////
// Helpers    //
////////////////
