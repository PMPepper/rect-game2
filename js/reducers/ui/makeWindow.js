
const DEFAULT_STATE = {
  x: 0,
  y: 0
};

//Actions
export function moveWindowBy(reducerName, dx, dy) {
  return {
    type: `${reducerName}/MOVE_WINDOW_BY`,
    dx,
    dy
  };
}

//Reducer factory
export default function makeWindowReducer(reducerName) {
  const MOVE_WINDOW_BY = `${reducerName}/MOVE_WINDOW_BY`;

  return function reducer(state = DEFAULT_STATE, action) {
    switch(action.type) {
      case MOVE_WINDOW_BY:
        return {
          ...state,
          x: state.x + action.dx,
          y: state.y + action.dy,
        };
    }


    return state;
  }
}
