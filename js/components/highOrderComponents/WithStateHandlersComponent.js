import React from 'react';
import {getDisplayName} from 'recompose';



const obj = Object.freeze({});

function makeComparisonFunc(arr) {
  return (props, nextProps) => {
    return arr.some((propName) => {
      return nextProps[propName] !== props[propName];
    })
  }
}

function isStateGoingToChange(state, stateUpdate) {
  return Object.keys(stateUpdate).some((key) => {
    return state[key] !== stateUpdate[key];
  })
}

export default function WithStateHandlersComponent(
  initialState,
  handlers,
  {
    mapProps = null,
    withPropsOnChange = null,
    componentWillMount = null, //*
    componentDidMount = null,
    componentWillReceiveProps = null,//*
    shouldComponentUpdate = null,
    componentWillUpdate = null, //*
    componentDidUpdate = null,
    componentWillUnmount = null,
    componentDidCatch =- null
  } = {}
) {
  if(withPropsOnChange) {
    for(let i = 0; i < withPropsOnChange.length; i+=2) {
      if(withPropsOnChange[i] instanceof Array) {
        withPropsOnChange[i] = makeComparisonFunc(withPropsOnChange[i]);
      }
    }
  }

  return (PresentationalComponent) => {
    class Component extends React.Component {
      constructor(props) {
        super(props);

        this.state = initialState instanceof Function ? initialState(props) : {...initialState};

        handlers && Object.keys(handlers).forEach((name) => {
          const handler = handlers[name];

          this.state[name] = (...args) => {
            const result = handler(this.state, this.props).apply(this, args);

            if(result && isStateGoingToChange(this.state, result)) {//check if this has ACTUALLY changed anything
              const curProps = this._props(this.props);

              this.setState(result, withPropsOnChange && (() => {
                //once state changed, check if onChange handlers need to be run
                this._checkPropsOnChange(curProps, this._props(this.props));
              }));
            }
          }
        });

        if(withPropsOnChange) {
          this.componentWillMount = () => {
            componentWillMount && componentWillMount(this._props(this.props));

            this._checkPropsOnChange(obj, this.props, true);
          }

          this.componentWillReceiveProps = (nextProps) => {
            this._checkPropsOnChange(this._props(this.props), nextProps);

            componentWillReceiveProps && componentWillReceiveProps(this._props(nextProps), this._props(this.props))
          }
        }

        //lifecycle methods
        //I could (but probably won't) 'bounce' the calculated props to the
        //this.props object, to make this more transparent
        componentWillMount && !this.componentWillMount && (this.componentWillMount = function() {componentWillMount(this._props(this.props))});
        componentDidMount && (this.componentDidMount = function() {componentDidMount(this._props(this.props))});
        componentWillReceiveProps && !this.componentWillReceiveProps && (this.componentWillReceiveProps = function() {componentWillReceiveProps(this._props(this.props))});
        shouldComponentUpdate && (this.shouldComponentUpdate = function(nextProps, nextState) {return shouldComponentUpdate(this._props(nextProps), this._props(this.props), nextState)});
        componentWillUpdate && (this.componentWillUpdate = function(nextProps) {return componentWillUpdate(this._props(nextProp), this._props(this.props))});
        componentDidUpdate && (this.componentDidUpdate = function(prevProps, prevState) {return componentDidUpdate(this._props(prevProps), this._props(this.props), prevState)});
        componentWillUnmount && (this.componentWillUnmount = function() {return componentWillUnmount(this._props(this.props))});
        componentDidCatch && (this.componentDidCatch = componentDidCatch);
      }

      _props(curProps, doMap = false) {
        const mergedProps = {...curProps, ...this.state};

        return mapProps && doMap ? mapProps(mergedProps) : mergedProps
      }

      _checkPropsOnChange(props, nextProps, onMount = false) {
        let isStateChanged = false;
        let newState = null;

        for(let i = 0; i < withPropsOnChange.length; i += 2) {
          let updatedProps = {...nextProps, ...this.state, ...newState};

          if(withPropsOnChange[i](props, updatedProps)) {
            let result = withPropsOnChange[i+1](updatedProps, onMount);

            if(result !== undefined) {
              isStateChanged = true;
              newState = {...newState, ...result};
            }
          }
        }

        if(isStateChanged) {
          this.setState(newState);
        }
      }

      render() {
        return <PresentationalComponent {...this._props(this.props, true)} />
      }

      static displayName = `WithStateHandlersComponent(${getDisplayName(PresentationalComponent)})`;
    }

    return Component;
  }
}
