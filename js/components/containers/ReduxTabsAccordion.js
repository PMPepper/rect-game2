import React from 'react';
import {connect} from 'react-redux';
import {compose, withPropsOnChange} from 'recompose';
import {bindActionCreators} from 'redux';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';
import MonitorSizeComponent from '../highOrderComponents/MonitorSizeComponent';

//Presentational
import TabsAccordion from '../presentational/TabsAccordion';

//Reducers
import {setSelectedIndex} from '../../reducers/ui/makeTabs';

//Helpers
import {resolveObjPath} from '../../helpers/Object';

//The component
export default compose(
  connect((state, {reducerName}) => {
    return resolveObjPath(state, reducerName);
  }, (dispatch, {reducerName}) => {
    return bindActionCreators({
      setSelectedIndex: (selectedIndex) => (setSelectedIndex(reducerName, selectedIndex))
    }, dispatch);
  }),
  MonitorSizeComponent(),
  withPropsOnChange(['outerWidth'], ({outerWidth, threshold = 500}) => ({
    accordion: outerWidth < threshold
  })),
  BEMComponent('tabsAccordion'),
)(TabsAccordion);
