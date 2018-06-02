
const DEFAULT_STATE = {
  selectedIndex: 0
};

//Actions
export function setSelectedIndex(reducerName, selectedIndex) {
  return {
    type: `${reducerName}/SET_SELECTED_INDEX`,
    selectedIndex
  };
}

//Reducer factory
export default function makeWindowReducer(reducerName) {
  const SET_SELECTED_INDEX = `${reducerName}/SET_SELECTED_INDEX`;

  return function reducer(state = DEFAULT_STATE, action) {
    switch(action.type) {
      case SET_SELECTED_INDEX:
        return {
          ...state,
          selectedIndex: action.selectedIndex
        };
    }

    return state;
  }
}
