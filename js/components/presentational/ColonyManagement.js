import React from 'react';
import PropTypes from 'prop-types';

/*
//temp?
import BEMComponent from '../highOrderComponents/BEMComponent';
import TabsAccordion from './TabsAccordion';
const Tabs = BEMComponent('tabsAccordion', {
  accordion: {
    type: PropTypes.bool,
    default: false,
    preset: false
  }
})(TabsAccordion);*/

//
import ReduxTabsAccordion from '../containers/ReduxTabsAccordion';


export default function ColonyManagement({}) {
  return <article className="colonyManagement">
    <h2>Colony management</h2>
    <ReduxTabsAccordion reducerName="ui.colonyManagement.tabs" id="colonyManagementTabs">
      <div name="tab1" label="[Tab 1]">Tab 1</div>
      <div name="tab2" label="[Tab 2]">Tab 2</div>
      <div name="tab3" label="[Tab 3]">Tab 3</div>
      <div name="tab4" label="[Tab 4]">Tab 4</div>
      <div name="tab5" label="[Tab 5]">Tab 5</div>
    </ReduxTabsAccordion>
  </article>
}
