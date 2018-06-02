import React from 'react';
import {compose, withProps} from 'recompose';

import GenericFilter from './GenericFilter';

const typeKeys = ['lessThan', 'greaterThan', 'between'];

const NumberFilter = compose(
  withProps({
    getAppliedContent: (filter, settings, localisation) => {
      return localisation.formatString(
        localisation[`filter-${filter.name}-${typeKeys[+settings.active]}-applied`],
        (+settings.active) === 2 ? settings['2'].values.value : [settings[settings.active+''].values.value]);
    }
  })
)(
  GenericFilter
);

//Value = the value to check against the filter, filterType is the configuration
//options for this specific filter, and settings are the options the user has
//selected for this filter
NumberFilter.filterMethod = (value, filterType, settings) => {
  value = +value;

  switch(''+settings.active) {
    case '0'://less than
      return value < +settings['0'].values.value;
    case '1'://greater than
      return value > +settings['1'].values.value;
    case '2'://between
      return value >= +settings['2'].values.value[0] && value <= +settings['2'].values.value[1];
  }
}

export default NumberFilter;
