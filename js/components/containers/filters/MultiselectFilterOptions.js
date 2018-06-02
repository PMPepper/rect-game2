import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';


//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';


//Legacy
import Form from '../../../widgets/forms/Form';


//The Component
const MultiselectFilterOptions = compose(
  BEMComponent('multiselectFilterOption')
)(function({filter, baseClass, getElementClass, settings, setFilterSettings}) {
  return <div className={baseClass}>
    <div className="g-simpleBox">
      <Form
        onSubmit={(action, values) => {
          setFilterSettings({value: values[filter.name]})
        }}
        definition={{name: 'selectFilterOptionsForm',
          theme: 'default',
          fields: [
            {
              ...filter.otherFieldOptions,
              name: filter.name,
              type: 'checkboxes',
              suppressOptional: true,
              options: filter.options,
              localisationLabel: filter.fieldLabel,
              value: settings ? settings.value : null
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


export default MultiselectFilterOptions;
