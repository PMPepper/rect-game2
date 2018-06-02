import React from 'react';
import {getDisplayName} from 'recompose';

//allow updates if window height changes even if has no effect on div size?
//I know there was a reason for this, but I can't recall what it was

export default function MonitorSizeComponent({
  resizeWithWindowVertical = false,
  resizeWithWindowHorizontal = false,
  mergeProps = (ownProps, addedProps) => {
    return {...ownProps, ...addedProps};
  },
  mapProps = props => (props)
} = {}) {

  return (PresentationalComponent) => {
    return class extends React.Component {
      state = {};
      _lastWindowWidth = 0;
      _lastWindowHeight = 0;

      componentWillMount() {
        addComponent(this);
      }

      componentWillUnmount() {
        removeComponent(this);
      }

      _getRef = (elem) => {
        if(elem && elem !== this._elem) {
          this._elem = elem;

          this._updateSize();
        }
      }

      _updateSize() {
        const elem = this._elem;
        const state = this.state;

        if(!elem || !document.body.contains(elem) || !elem.offsetWidth) {
          this._lastWindowWidth = 0;
          this._lastWindowHeight = 0;

          return;
        }

        if(
          elem.offsetWidth != state.outerWidth ||
          elem.offsetHeight != state.outerHeight ||
          elem.clientWidth != state.innerWidth ||
          elem.clientHeight != state.innerHeight ||
          resizeWithWindowVertical && (window.innerHeight != this._lastWindowHeight) ||
          resizeWithWindowHorizontal && (window.innerWidth != this._lastWindowWidth)
        ) {
          try {
            this.setState({
              outerWidth: elem.offsetWidth,
              outerHeight: elem.offsetHeight,
              innerWidth: elem.clientWidth,
              innerHeight: elem.clientHeight
            });
          }
          catch(e) {
            //This can sometimes be called once element has been unmounted, so need to suppress errors
          }
        }

        this._lastWindowWidth = window.innerWidth;
        this._lastWindowHeight = window.innerHeight;
      }

      render() {
        return <div className="responsive" ref={this._getRef}>
          <PresentationalComponent {...mergeProps(this.props, mapProps(this.state))}>{this.props.children}</PresentationalComponent>
        </div>
      }

      static displayName = `MonitorSizeComponent(${getDisplayName(PresentationalComponent)})`;
    }
  }
}


const components = [];

function addComponent(component) {
  if(!component) {
    return;
  }

  if(components.length == 0) {
    addListeners();
  }

  components.push(component);
}

function removeComponent(component) {
  const index = components.indexOf(component);

  if(index === -1) {
    return;
  }

  components.splice(index, 1);

  if(components.length == 0) {
    clearListeners();
  }
}

function addListeners() {
  window.addEventListener('resize', onResize);
}

function clearListeners() {
  window.removeEventListener('resize', onResize);
}


let resizedTId = null;
let debounceDelay = 0.4;

function onResize(e) {
  if(resizedTId !== null) {
    clearTimeout(resizedTId);
    resizedTId = null;
  }

  resizedTId = setTimeout(doResize, debounceDelay*1000);
}

function doResize() {
  resizedTId = null;

  components.forEach((component) => {
    component._updateSize();
  })
}
