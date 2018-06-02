import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//HOCs
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';

//Presentational
import Game from '../presentational/Game';


//The component
export default compose(
  connect((state, ownProps) => {
    const controlledFactionId = state.ui.controlledFactionId;

    return {
      systemBodies: state.game.systemBodies,
      factionSystemBodies: state.game.factionSystemBody.factionSystemBody[controlledFactionId],
      controlledFactionId
    }
  }, {}),
  WithStateHandlersComponent(
    {
      element: null,
      contextMenu: null
    },
    {
      setElement: () => (element) => ({element}),
      //TODO hardcoded to just system bodies - needs to handle other types of contextmenu
      setContextMenu: (state, {factionSystemBodies}) => (e = null, systemBodies = null) => {
        if(!systemBodies || systemBodies.length === 0) {
          return {contextMenu: null};//Close the context menu
        }

        const tempAction = () => {console.log('action');}

        const items = systemBodies.map(bodyPositions => {
          const systemBody = bodyPositions.systemBody;

          return {
            label: factionSystemBodies[systemBody.id].name,
            icon: <i className="fas fa-globe"></i>,
            action: null,
            disabled: false,
            items: [{
              label: 'Hello',
              action: () => {alert('Hello yourself!')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            }, {
              label: 'World',
              action: () => {alert('burld')}
            },
            'spacer',
            {
              label: 'Crazy',
              items: [{label: 'Shit', action: tempAction}, {label: 'Boy!', action: tempAction}]
            }]
          };
        });

        items.push('spacer');
        items.push({label: 'Foo', action: tempAction});
        items.push({label: 'Bar', action: tempAction});
        items.push({label: 'Goo', action: tempAction, disabled: true});
        items.push({label: 'Voo', action: tempAction});
        items.push({label: 'Lumpy gum joo woo', action: tempAction});

        return {
          contextMenu: {
            x: e.clientX,
            y: e.clientY,
            items
          }
        };
      }
    },
    {
      withPropsOnChange: [],
    }
  )
)(Game);
