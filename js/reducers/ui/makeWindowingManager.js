//helpers
import {arrayRemove} from '../../helpers/Array';

//Actions
export function openWindow(reducerName, windowName) {
  return {
    type: `${reducerName}/OPEN_WINDOW`,
    windowName
  }
}

export function focusWindow(reducerName, windowName) {
  return {
    type: `${reducerName}/FOCUS_WINDOW`,
    windowName
  }
}

export function closeWindow(reducerName, windowName) {
  return {
    type: `${reducerName}/CLOSE_WINDOW`,
    windowName
  }
}

//Reducer factory
export default function makeWindowingManagerReducer(reducerName) {
  const OPEN_WINDOW = `${reducerName}/OPEN_WINDOW`;
  const FOCUS_WINDOW = `${reducerName}/FOCUS_WINDOW`;
  const CLOSE_WINDOW = `${reducerName}/CLOSE_WINDOW`;

  return function reducer(state = [], action) {
    let index;

    switch(action.type) {
      case OPEN_WINDOW:
        index = state.indexOf(action.windowName);

        if(index === -1) {
          return [...state, action.windowName];//open the window
        } else if(index == state.length - 1) {
          return state;//no need to change, window is already open on top
        }

        //Remove from current position in state and add to end
        return [...state.slice(0, index), ...state.slice(index+1), action.windowName];
      case FOCUS_WINDOW:
        index = state.indexOf(action.windowName);

        if(index !== -1 && index !== state.length - 1) {
          //Remove from current position in state and add to end
          return [...state.slice(0, index), ...state.slice(index+1), action.windowName];
        }

        break;
      case CLOSE_WINDOW:
        return arrayRemove(state, action.windowName);
    }

    return state;
  }
}
