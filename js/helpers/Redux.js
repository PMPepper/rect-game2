import {resolveObjPath} from './Object';
import {ucFirst} from './String';
import simpleClone from '../utils/simpleClone';


let defaultStore = null;

export function setDefaultStore(store) {
  defaultStore = store;
}

export function getState(store = defaultStore) {
  return store.getState();
}

export function subscribe(handler, store = defaultStore) {
  if(!store) {
    throw new Error('No store');
  }

  let realUnsubscribe = store.subscribe(() => {
    const state = store.getState();
    const unsubscribe = () => {
      if(realUnsubscribe) {
        realUnsubscribe();
        realUnsubscribe = null;
      }
    }

    handler(store, state, unsubscribe);
  });
}

export function isActionMatched(action, matcher) {
  switch(typeof(matcher)) {
    case 'string':
      return action.type === matcher;
    case 'function':
      return matcher(action);
    case 'object':
      if(matcher instanceof Array) {
        return matcher.some(childMatcher => isActionMatched(action, childMatcher));
      } else if(matcher instanceof RegExp) {
        return action.type.match(matcher);
      }
  }
  return false;
}

/*
export function promiseFromAddingReducer(reducerPath, store = defaultStore) {
  if(!store) {
    throw new Error('No store');
  }

  return new Promise((resolve, reject) => {
    let lastReducerState = null;

    //This is called each time the state changes
    subscribe((store, state, unsubscribe) => {
      //gets the relevent reducer
      const reducer = resolveObjPath(state, reducerPath);

      //if it has changed
      if(reducer !== lastReducerState) {
        if(reducer.loaded) {
          unsubscribe();

          resolve(reducer);
        }

        if(reducer.error) {
          unsubscribe();

          reject(new BIPsError(reducer.errorCode, reducer.errorMsg || null));
        }

        //-store changed state;
        lastReducerState = reducer;
      }
    }, store);
  });
}

export const promiseFromLoadReducer = promiseFromAddingReducer;*/

export function arrayReducer(defaultChildState, childReducer, {push = Number.NaN, remove = Number.NaN, clear = Number.NaN, pop = Number.NaN, shift = Number.NaN, unshift = Number.NaN, splice = Number.NaN, init = Number.NaN, indexProp = 'index', dataProp = 'data'}, debug = false) {
  return function(state=[], action) {
    if(!state) {
      state = [];
    }

    if(!action || action.type.startsWith('@@redux/')) {
      return state;
    }

    if(debug) {
      debugger;
    }

    if(isActionMatched(action, push)) {
      return [...state, childReducer(defaultChildState, action)]
    } else if(isActionMatched(action, remove)) {
      return [...state.slice(0, action[indexProp]), ...state.slice(action[indexProp]+1)];
    } else if(isActionMatched(action, clear)) {
      return [];
    } else if(isActionMatched(action, pop)) {
      return [...state.slice(0, -1)];
    } else if(isActionMatched(action, shift)) {
      return [...state.slice(1)];
    } else if(isActionMatched(action, unshift)) {
      return [childReducer(defaultChildState, action), ...state.slice()];
    } else if(isActionMatched(action, splice)) {
      return [...state.slice(0, action[indexProp]), childReducer(defaultChildState, action), ...state.slice(action[indexProp])];
    } else if(isActionMatched(action, init)) {
      return action[dataProp].map((item) => (childReducer(defaultChildState, {...action, [dataProp]: item})));
    } else {
      //broadcast action to children
      const newState = [];
      let hasChanged = false;

      state.forEach(item => {
        const newItem = childReducer(item, action);

        if(newItem !== item) {
          hasChanged = true;
        }

        newState.push(newItem);
      });

      if(hasChanged) {
        return newState;
      }
    }

    return state;
  }
}

export function objectReducer(defaultChildState, childReducer, {
    assign = Number.NaN, edit = Number.NaN, remove = Number.NaN, merge = Number.NaN, clear = Number.NaN, idProp = 'id', dataProp = 'data'
  }, customActionHandlers = null, debug=false
) {
  return function(state={}, action) {
    if(debug) {
      debugger;
    }

    if(!state) {
      state = {};
    }

    if(!action || action.type.startsWith('@@redux/')) {
      return state;
    }

    if(customActionHandlers && customActionHandlers.hasOwnProperty(action.type)) {
      return customActionHandlers[action.type](state, action, childReducer);
    }


    if(isActionMatched(action, assign)) {
      return {...action.data};
    } else if(isActionMatched(action, edit)) {
      if(!action[idProp]) {
        debugger;
      }

      return {
        ...state,
        [action[idProp]]: childReducer((state[action[idProp]] || simpleClone(defaultChildState)), action)
      };
    } else if(isActionMatched(action, remove)) {
      if(!action[idProp]) {
        debugger;
      }

      return Helpers.cloneObjectWithoutKeys(state, [action[idProp]]);
    } else if(isActionMatched(action, merge)) {
      return {...state, ...Helpers.mapObj(action[dataProp], (value) => {
        return childReducer(value, action);
      })}
    } else if(isActionMatched(action, clear)) {
      return {};
    } else {
      const newState = {};
      let hasChanged = false;

      Object.keys(state).forEach(id => {
        const item = state[id];

        const newItem = childReducer(item, action);

        if(newItem !== item) {
          hasChanged = true;
        }

        newState[id] = newItem;
      })

      if(hasChanged) {
        return newState;
      }
    }

    return state;
  }
}

export function assignPropReducer(defaultState, prop, actions = null) {
  return (state = defaultState, action) => {
    if(!action || action.type.startsWith('@@redux/')) {
      return state;
    }

    if(!actions || isActionMatched(action)) {
      return action[prop];
    }

    return state;
  }
}

export function joinReducer(a, b, {add = [], remove = [], dataProp = 'data', aProp = null, bProp = ''}) {
  const aToB = a + ucFirst(b);
  const bToA = b + ucFirst(a);

  aProp = aProp || `${a}Id`;
  bProp = bProp || `${b}Id`;

  const defaultState = {
    [aToB]: {},
    [bToA]: {}
  };

  return (state = defaultState, action) => {
    if(isActionMatched(action, add)) {
      //add
      return {
        [aToB]: {
          ...state[aToB],
          [action[aProp]] : {
            ...state[aToB][action[aProp]],
            [action[bProp]]: action[dataProp]
          }
        },
        [bToA]: {
          ...state[bToA],
          [action[bProp]] : {
            ...state[bToA][action[bProp]],
            [action[aProp]]: action[dataProp]
          }
        }
      }

    } else if(isActionMatched(action, remove)) {
      //remove
      debugger;
    }

    return state;
  }
}
