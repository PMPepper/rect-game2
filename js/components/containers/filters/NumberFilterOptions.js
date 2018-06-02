import React from 'react';
import PropTypes from 'prop-types';
import {compose, withState} from 'recompose';


//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';


//containers
import Text from '../Text';
import Accordion from '../../containers/Accordion';


//presentational
import {SingleVerticalSlideTransition} from '../../presentational/Transitions';

//Legacy
import Form from '../../../widgets/forms/Form';


//the Component
const NumberFilterOptions = compose(
  BEMComponent('numberFilterOption'),
  withState('currentFilterState', 'setCurrentFilterState', (props) => {
    const settings = props.settings;
    const filter = props.filter;

    //First time you open, initialise state with defaults, otherwise restore from saved state
    return settings ? settings :
      {
        active: 0,
        hasSubmitted: false,
        '0': {
          values: {
            value: filter.lessThanDefault
          }
        },
        '1': {
          values: {
            value: filter.greaterThanDefault
          }
        },
        '2': {
          values: {
            value: filter.betweenDefault
          }
        }
      }//set to filter defaults
  }),
)(function({filter, baseClass, getElementClass, settings, setFilterSettings, currentFilterState, setCurrentFilterState}) {
  const activeFilterState = currentFilterState[currentFilterState.active];
  const activeFilterErrors = activeFilterState.errors && Object.values(activeFilterState.errors).filter((val) => {return !!val});

  return <div className={baseClass}>
    <div className="g-simpleBox">
      <div className="g-space">
        <Accordion selectedIndex={+currentFilterState.active} onRequestChangeSelected={(open) => {
          setCurrentFilterState({
            ...currentFilterState,
            active: open
          })

          return open;
        }}>
          <div label={<Text id={filter.lessThanLabelLangKey || 'filter-number-lessThan'} />}>
            <Form onSubmit={(action, values) => {
                //Just do nothing
              }}
              onFormChange={(values, errors, form, isSubmitted, nameOfChangingField) => {
                setCurrentFilterState({
                  ...currentFilterState,
                  '0': {
                    values: values,
                    errors: errors
                  }
                })
              }}
              definition={{
                name: 'numberFilterOptions-lessThanForm',
                fields: [
                  {
                    ...filter.numberFieldOptions,
                    name: 'value',
                    type: 'number',
                    localisationLabel: filter.lessThanFieldLangKey || 'filter-number-lessThan-fieldLabel',
                    isRequired: true,
                    value: currentFilterState[0].values.value
                  }
                ],
                actions: []
              }}
              suppressErrors={true}
            />
          </div>
          <div label={<Text id={filter.greaterThanLabelLangKey || 'filter-number-greaterThan'} />}>
            <Form onSubmit={(action, values) => {
                //Just do nothing
              }}
              onFormChange={(values, errors, form, isSubmitted, nameOfChangingField) => {
                setCurrentFilterState({
                  ...currentFilterState,
                  '1': {
                    values: values,
                    errors: errors
                  }
                })
              }}
              definition={{
                name: 'numberFilterOptions-greaterThanForm',
                fields: [
                  {
                    ...filter.numberFieldOptions,
                    name: 'value',
                    type: 'number',
                    localisationLabel: filter.greaterThanFieldLangKey || 'filter-number-greaterThan-fieldLabel',
                    isRequired: true,
                    value: currentFilterState[1].values.value
                  }
                ],
                actions: []
              }}
              suppressErrors={true}
            />
          </div>
          <div label={<Text id={filter.betweenLabelLangKey || 'filter-number-between'} />}>
          <Form onSubmit={(action, values) => {
              //Just do nothing
            }}
            onFormChange={(values, errors, form, isSubmitted, nameOfChangingField) => {
              setCurrentFilterState({
                ...currentFilterState,
                '2': {
                  values: values,
                  errors: errors
                }
              })
            }}
            definition={{
              name: 'numberFilterOptions-betweenForm',
              fields: [
                {
                  ...filter.numberFieldOptions,
                  name: 'value',
                  type: 'between',
                  localisationLabel: filter.betweenFieldLangKey || 'filter-number-between-fieldLabel',
                  isRequired: true,
                  value: currentFilterState[2].values.value,

                }
              ],
              actions: []
            }}
            suppressErrors={true}
          />
          </div>
        </Accordion>
      </div>
      <SingleVerticalSlideTransition>
        {activeFilterErrors && activeFilterErrors.length > 0 && currentFilterState.hasSubmitted && <div className="g-space">
          <ul className="g-basicUL">
            {activeFilterErrors.map((fieldErrors) => {
              return fieldErrors.map((error) => {
                return <li className="g-basicUL-item g-error" key={error}>{error}</li>
              });
            })}
          </ul>
        </div>}
      </SingleVerticalSlideTransition>
      <div className="g-btns g-btns_right">
        <button type="button" className="g-btn g-btn_size_small g-btn_secondary js-closeModalBtn"><Text id={filter.cancelBtnLangKey || 'filter-cancel-label'} /></button>
        <button type="submit" className="g-btn g-btn_size_small" onClick={() => {
          if(activeFilterErrors && activeFilterErrors.length > 0) {
            setCurrentFilterState({
              ...currentFilterState,
              hasSubmitted: true
            })
          } else {
            //actually 'submit' values
            setFilterSettings({...currentFilterState, hasSubmitted: false});
          }
        }}><Text id={filter.applyBtnLangKey || 'filter-apply-label'} /></button>
      </div>
    </div>
  </div>;
});


export default NumberFilterOptions;
