import {combineReducers} from 'redux';

import device from './device';
import localisation from './localisation';
import game from './gameClient';
import ui from './ui';


const reducer = combineReducers({
  device,
  localisation,
  game,
  ui
});

export default reducer;
