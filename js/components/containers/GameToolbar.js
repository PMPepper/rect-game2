import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';

//Reducers
import {openWindow} from '../../reducers/ui/makeWindowingManager';

//Constants
const buttons = [
  {
    name: 'openColonyManagementWindow',
    action: 'openWindow',
    actionArgs: ['ui.gameWM', 'ui.colonyManagement.window']
  },
  {
    name: 'openSystemOverviewWindow',
    action: 'openWindow',
    actionArgs: ['ui.gameWM', 'ui.systemOverview.window']
  }
];

export default compose(
  connect(state => {
    return {};
  }, {
    openWindow
  }),
  BEMComponent('gameToolbar')
)(function GameToolbar({baseClass, baseClassName, getElementClass, ...rest}) {
  return <ul className={baseClass}>
    {buttons.map(button => {
      return <li className={getElementClass('item')} key={button.name}>
        <button className={getElementClass('action')} type="button" onClick={makeButtonClickAction(button, rest)}>[{button.name}]</button>
      </li>
    })}
  </ul>
});

//Internal helpers
function makeButtonClickAction(button, props) {
  switch(button.action) {
    case 'openWindow':
      return () => {
        props.openWindow.apply(null, button.actionArgs);
      }
    default:
      return null;
  }
}
