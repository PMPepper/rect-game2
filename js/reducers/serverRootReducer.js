console.log('rootReducer');

import {combineReducers} from 'redux';

import game from './game';
import server from './server';


const reducer = combineReducers({
  server,
  game
});

export default reducer;
