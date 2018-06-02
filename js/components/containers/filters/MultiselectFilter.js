import React from 'react';
import {compose, withProps} from 'recompose';

import GenericFilter from './GenericFilter';

import FormattedText from '../FormattedText';

const MultiselectFilter = compose(
  withProps({
    getAppliedContent: (filter, settings, localisation) => {
      const values = settings.value;

      return <FormattedText id={`filter-${filter.name}-applied`} params={{value: values.reduce((arr, value, index) => {
        if(value) {
          arr.push(filter.options[index].label)
        }

        return arr;
      }, [])}} />
    }
  })
)(
  GenericFilter
);

//Value = the value to check against the filter, filterType is the configuration
//options for this specific filter, and settings are the options the user has
//selected for this filter
MultiselectFilter.filterMethod = (value, filterType, settings) => {
  const values = settings.value.reduce((arr, value, index) => {
    if(value) {
      arr.push(filterType.options[index].value);
    }

    return arr;
  }, []);

  return values.indexOf(value) !== -1;
}

export default MultiselectFilter;
