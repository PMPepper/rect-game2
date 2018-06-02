//Is this actually being used anywhere?
//Might it be wanted?

export default function lastPropsIfNot(mapStateToProps, testFunc) {
  return () => {
    let lastState = null;

    return (state, ownProps) => {
      if(testFunc(state, ownProps)) {
        lastState = mapStateToProps(state, ownProps);
      }

      return lastState;
    }
  }
}

export function userLoggedIn(state, ownProps) {
  return state.user.data.username !== null;
}

export function mergeTests(...args) {
  return (state, ownProps) => {
    return args.every((test) => {
      return test(state, ownProps);
    });
  };
}
