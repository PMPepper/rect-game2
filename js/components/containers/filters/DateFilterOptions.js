import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';


//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';


//Legacy
import Form from '../../../widgets/forms/Form';

function toDateString(date) {
  return date ?
    (date === NOW ? new Date() : new Date(date)).toISOString().split('T')[0]
    :
    null;
}

//TODO prevent picking max date before min date


export const NOW = 'NOW';

//The Component
const DateFilterOptions = compose(
  BEMComponent('dateFilterOption')
)(function({filter, baseClass, getElementClass, settings, setFilterSettings}) {
  return <div className={baseClass}>
    <div className="g-simpleBox">
      <Form
        onSubmit={(action, values) => {
          setFilterSettings({startDate: new Date(values.startDate), endDate: values.endDate ? new Date(values.endDate) : null})
        }}
        definition={{name: 'dateFilterOptionsForm',
          theme: 'default',
          fields: [
            {
              ...filter.otherFieldOptions,
              name: `startDate`,
              type: 'date',
              isRequired: true,
              localisationLabel: filter.startDateFieldLabel,
              value: settings ? toDateString(settings.startDate) : null,
              min: toDateString(filter.min),
              max: toDateString(filter.max)
            },
            {
              ...filter.otherFieldOptions,
              name: `endDate`,
              type: 'date',
              localisationLabel: filter.endDateFieldLabel,
              value: settings ? toDateString(settings.endDate) : null,
              min: toDateString(filter.min),
              max: toDateString(filter.max)
            }
          ],
          actions: [
            {
              name: 'cancel',
              noValidate: true,
              className: 'js-closeModalBtn',
              secondary: true,
              modifiers: {
                size: 'small'
              },
              label: filter.cancelLabel || 'filter-cancel-label'
            },
            {
              name: 'apply',
              isDefault: true,
              modifiers: {
                size: 'small'
              },
              label: filter.applyLabel || 'filter-apply-label'
            }
          ]
        }}
      />
    </div>
  </div>;
});


DateFilterOptions.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    otherFieldOptions: PropTypes.object,
    cancelLabel: PropTypes.string,
    applyLabel: PropTypes.string
  }).isRequired,
  settings: PropTypes.object,
  setFilterSettings: PropTypes.func.isRequired
};


export default DateFilterOptions;
