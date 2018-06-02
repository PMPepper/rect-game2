import React from 'react';
import {compose, withProps} from 'recompose';

import GenericFilter from './GenericFilter';


const SelectFilter = compose(
  withProps({
    getAppliedContent: (filter, settings, localisation) => {
      return localisation.formatString(localisation[`filter-${filter.name}-applied`], {
        value: filter.options[settings.value].label
      });
    }
  })
)(
  GenericFilter
);

//Value = the value to check against the filter, filterType is the configuration
//options for this specific filter, and settings are the options the user has
//selected for this filter
SelectFilter.filterMethod = (value, filterType, settings) => {
  return value === settings.value;
}

export default SelectFilter;
