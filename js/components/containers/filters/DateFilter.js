import React from 'react';
import {compose, withProps} from 'recompose';

import GenericFilter from './GenericFilter';

import FormattedText from '../FormattedText';

//Presentational
import Time from '../../presentational/Time';


const DateFilter = compose(
  withProps({
    getAppliedContent: (filter, settings) => {
      return settings.endDate ?
        <FormattedText id={`filter-${filter.name}-applied-range`} params={{startDate: <Time date={settings.startDate} format="date" key="startDate" />, endDate: <Time date={settings.endDate} format="date" key="endDate" />}} />
        :
        <FormattedText id={`filter-${filter.name}-applied`} params={{startDate: <Time date={settings.startDate} format="date" key="startDate" />}} />
    }
  })
)(
  GenericFilter
);

//Value = the value to check against the filter, filterType is the configuration
//options for this specific filter, and settings are the options the user has
//selected for this filter
DateFilter.filterMethod = (value, filterType, settings) => {
  return settings.endDate ?
    value >= settings.startDate && value < tomorrow(settings.endDate)
    :
    value >= settings.startDate;
}

//sets date object to 00:00, tomorrow
function tomorrow(date) {
  const endDay = new Date(date);

  endDay.setUTCHours(0);
  endDay.setUTCMinutes(0);
  endDay.setUTCSeconds(0);
  endDay.setUTCMilliseconds(0);
  endDay.setUTCDate(endDay.getUTCDate()+1);

  return endDay;
}

export default DateFilter;
