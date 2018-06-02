//The game client logic goes here

//React
import React from 'react'
import {render} from 'react-dom';

//Redux
import {Provider} from 'react-redux';

//Components
import Game from '../components/containers/Game';

//Reducers
import {setControlledFaction, tick} from '../reducers/ui';
import {update} from '../reducers/gameClient';

//Consts
import MessageTypes from '../consts/MessageTypes';


export default class GameClient {
  /*
  let store;
  let connector;
  let definition
  let playerId;
  */

  constructor(aStore, aConnector) {
    this.store = aStore;
    this.connector = aConnector;
  }

  startGame(definition, playerName) {
    const connector = this.connector;

    console.log('CLIENT: start game', definition, playerName);
    connector.connect(this, () => {
      console.log('CLIENT: connected to server');
      connector.sendMessageToServer(MessageTypes.CREATE_WORLD, definition, (gameName) => {
        console.log('CLIENT: Game created: ', gameName);
        this._connectPlayer(gameName, playerName);
      });
    });
  }

  joinGame(gameName, playerName) {
    connector.connect(this, () => {
      this._connectPlayer(gameName, playerName);
    });
  }

  _connectPlayer(gameName, playerName) {
    console.log('CLIENT: connecting player: ', gameName, playerName);
    this.connector.sendMessageToServer(MessageTypes.CONNECT_PLAYER, {gameName, playerName}, ({playerId, data}) => {
      console.log('CLIENT: Player connected: ', playerId, data);
      this.playerId = playerId;

      this.store.dispatch(update(playerId, data));
    });
  }

  //Sever letting everyone know when someone connects
  playerIsConnected({playerId, connectedPlayers, pendingPlayers}) {
    //TODO
  }

  allPlayersConnected() {
    console.log('CLIENT: All players connected');

    const store = this.store;

    //start the game rolling!
    render(
      <Provider store={store}>
        <Game />
      </Provider>,
      document.getElementById('app')
    );

    //set initial controlled faction
    const state = store.getState();
    const factionIds = Object.keys(state.game.factionPlayer.playerFaction[this.playerId]);

    store.dispatch(setControlledFaction(factionIds[0]));

    //Start the ui tick
    setInterval(() => {
      store.dispatch(tick())
    }, (1000 / 60));
  }

  updatePlayerState({playerId, data}) {
    //console.log('CLIENT: Update player state: ', playerId, data);
    this.store.dispatch(update(playerId, data));
  }

  onMessage(type, data) {
    //type should never start with _
    if(this[type]) {
      return this[type](data);
    }

    console.log('Unknown message from server: ', type, data);
  }
}



///////
/*

import {tempInitGameState} from '../temp/temp';
import {tick} from '../reducers/ui';
import * as connector from '../connectors/workerConnector';
//import * as connector from './connectors/localConnector';

tempInitGameState(store, connector, () => {
  //Initialise the app
  render(
    <Provider store={store}>
      <Game />
    </Provider>,
    document.getElementById('app')
  );

  //set initial controlled faction
  const state = store.getState();
  const factionIds = Object.keys(state.game.factionPlayer.playerFaction[state.game.playerId]);

  store.dispatch(setControlledFaction(factionIds[0]));

  //Start the ui tick
  setInterval(() => {
    store.dispatch(tick())
  }, (1000 / 60));


});*/
