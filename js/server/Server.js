console.log('Server');

import {createStore, applyMiddleware} from 'redux';
import {enableBatching, batchActions} from 'redux-batched-actions';
import ReduxThunk from 'redux-thunk';

//Consts
import MessageTypes from '../consts/MessageTypes';

//Methods
import createWorldFunc from './createWorld';

//Reducers
import rootReducer from '../reducers/serverRootReducer';
import {playerConnected} from '../reducers/server';
import {advanceTime} from '../reducers/game';

//Helpers
import {objFilter, mapObj, objForEach} from '../helpers/Object';
import {arrayHasIntersection} from '../helpers/Array';



//Server knows nothing about how you're talking to the players, it just has methods called and sends messages which get handled by the 'connectors', e.g. worker

export default class Server {
  /*
  let store = null;
  let sendMessageToClients = null;

  let serverPhase = 'initialising';
  let gameLoopIntervalId;
  let gameName = null;
  */

  constructor() {
    this.serverPhase = 'initialising';

    const middlewares = [ReduxThunk];

    this.store = createStore(
      enableBatching(rootReducer),
      applyMiddleware.apply(this, middlewares)
    );
  }

  //have recieved message from player
  onMessage(type, data) {
    if(this[type]) {
      return this[type](data);
    }

    console.log('Unknown message from client: ', type, data);
  }

  createWorld(definition) {
    if(this.serverPhase !== 'initialising') {
      throw new Error('Can only create world while Server is in "initialising" phase');
    }

    //Create the world state
    const worldData = createWorldFunc(this.store, definition);

    //Now waiting for players to connect
    this.serverPhase = 'connecting';

    //Tell the client the world is created & what it's called
    return this.gameName = worldData.name;
  }

  connectPlayer({playerName}) {
    const store = this.store;
    const serverState = store.getState().server;
    const players = Object.values(serverState.players);

    const player = players.find(player => (player.name === playerName));//TODO get Id from name

    if(!player) {
      throw new Error(`Player '${playerName}' not found`);
    }

    const playerId = player.id;

    //mark player as connected, once all connected change game phase
    store.dispatch(playerConnected(playerId));

    //are all players connected?

    //Not happy with this - need better way to ensure messages get sent in order...
    setTimeout(() => {
      const serverState = store.getState().server;
      const players = Object.values(serverState.players);

      //delay this until after the response has been sent
      this.sendMessageToClients(
        MessageTypes.PLAYER_IS_CONNECTED,
        {
          playerId,
          connectedPlayers: players.filter(player => (player.isConnected)).map(player => ({id: player.id, name: player.name})),
          pendingPlayers: players.filter(player => (!player.isConnected)).map(player => ({id: player.id, name: player.name}))
        }
      );

      if(players.every(player => (player.isConnected))) {
        this._allPlayersConnected();
      }
    }, 1000);

    return {
      playerId,
      data: this._getStateForPlayer(playerId)
    };
  }

  _allPlayersConnected() {
    console.log('SERVER: allPlayersConnected');
    this.sendMessageToClients(MessageTypes.ALL_PLAYERS_CONNECTED);

    //Start running the actual game
    this.serverPhase = 'active';

    this.gameLoopIntervalId = setInterval(this._gameLoop, 1000 / 30);
  }

  _gameLoop = () => {
    for(let i = 0; i < 10; i++) {
      this._advanceGameTime(3600);
    }

    //Send updated state to all the connected players
    const state = this.store.getState();

    objForEach(state.server.players, (player) => {
      this.sendMessageToClients(
        MessageTypes.UPDATE_PLAYER_STATE,
        {
          playerId: player.id,
          data: this._getStateForPlayer(player.id)
        }
      );
    });
  }

  _advanceGameTime(amount) {
    this.store.dispatch(advanceTime(amount));
  }

  _getStateForPlayer(playerId) {
    const gameState = this.store.getState().game;
    const playerFactionIds = Object.keys(gameState.factionPlayer.playerFaction[playerId]);

    return {
      playerId,
      time: gameState.time,

      factions: objFilter(gameState.factions, (key, value, obj) => (playerFactionIds.includes(key))),
      players: gameState.players,

      factionPlayer: filterFactionStateByFactions(playerFactionIds, gameState.factionPlayer, 'factionPlayer', 'playerFaction'),

      //filter by faction
      systems: filterStateByFactions(playerFactionIds, gameState.systems, gameState.factionSystem.systemFaction),
      systemBodies: filterStateByFactions(playerFactionIds, gameState.systemBodies, gameState.factionSystemBody.systemBodyFaction),

      factionSystem: filterFactionStateByFactions(playerFactionIds, gameState.factionSystem, 'factionSystem', 'systemFaction'),
      factionSystemBody: filterFactionStateByFactions(playerFactionIds, gameState.factionSystemBody, 'factionSystemBody', 'systemBodyFaction'),

      //TODO add 'known factions' (and who controls them?)
      //TODO add 'known names' e.g. faction 1 knows what faction 2 calls a body...?
      //TODO
      jumpLocations: {}
    };
  }
}


//Internal helpers
function filterStateByFactions(factionIds, state, factionsStates) {

  return objFilter(state, (id, value, obj) => {
    const factionState = factionsStates[id];
    const stateFactionIds = Object.keys(factionState);

    return arrayHasIntersection(factionIds, stateFactionIds);
  });
}

function filterFactionStateByFactions(factionIds, factionState, key1, key2) {
  return {
    [key1]: objFilter(factionState[key1], (factionId, value, obj) => {
      return factionIds.includes(factionId);
    }),
    [key2]: mapObj(objFilter(factionState[key2], (stateId, value, obj) => {
      return arrayHasIntersection(factionIds, Object.keys(value));
    }), (value, key, obj) => {
      return objFilter(value, (factionId, value, obj) => {
        return factionIds.includes(factionId);
      });
    }),
  }
}

export function addPlayerOrders(playerId, orders) {
  //TODO
}
