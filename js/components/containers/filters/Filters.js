import React from 'react';
import PropTypes from 'prop-types';
import {compose, withState} from 'recompose';
import {connect} from 'react-redux'


//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';


//containers
import Text from '../Text';
import Modal from '../Modal';


//filters
import SelectFilter from './SelectFilter';
import MultiselectFilter from './MultiselectFilter';
import NumberFilter from './NumberFilter';
import DateFilter from './DateFilter';
import TextFilter from './TextFilter';

import MultiselectFilterOptions from './MultiselectFilterOptions';
import SelectFilterOptions from './SelectFilterOptions';
import NumberFilterOptions from './NumberFilterOptions';
import DateFilterOptions from './DateFilterOptions';
import TextFilterOptions from './TextFilterOptions';


//Legacy
import Form from '../../../widgets/forms/Form';


//constants
const defaultProps = {
  filtersSettings: []
};

import {FILTER_TYPE_SELECT, FILTER_TYPE_MULTISELECT, FILTER_TYPE_NUMBER, FILTER_TYPE_DATE, FILTER_TYPE_TEXT} from './FilterTypes';

const propTypes = {
  setFilterMethod: PropTypes.func.isRequired,
  filterTypes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.oneOf([FILTER_TYPE_SELECT, FILTER_TYPE_MULTISELECT, FILTER_TYPE_NUMBER, FILTER_TYPE_DATE, FILTER_TYPE_TEXT])
  })),
  filtersSettings: PropTypes.array,
  setFiltersSettings: PropTypes.func.isRequired
};


//The Component
const Filters = compose(
  withState('editingFilterIndex', 'setEditingFilterIndex', null),
  withState('isModalOpen', 'setIsModalOpen', false),
  BEMComponent('filters'),
  connect((state) => {
    return {
      localisation: state.localisation.data
    };
  }, {})
)(function FiltersPresentational({children, titleLangKey, filterTypes, setFilterMethod, filtersSettings, setFiltersSettings, editingFilterIndex, setEditingFilterIndex, isModalOpen, setIsModalOpen, baseClass, baseClassName, getElementClass, localisation, ...rest}) {
  const editingFilter = editingFilterIndex === null ? null : filterTypes[editingFilterIndex];

  function doSetFilterSettings(newSettings) {
    //create filter method
    const filterMethods = filterTypes.map((filter, index) => {
      const filterType = filterTypes[index]

      return getFilterMethod(filterType, newSettings[index] || null)
    }).filter((func) => {return !!func});

    setFilterMethod(combineFilters(filterMethods));
    setFiltersSettings(newSettings);
  }

  function setFilterSettingsFor(index) {
    return (newFilterSettings) => {
      const newSettings = [...filtersSettings];
      newSettings[index] = newFilterSettings;

      doSetFilterSettings(newSettings);
    }
  }

  return <div className={baseClass}>
    <h3 className={getElementClass('title')}><Text id={titleLangKey} /></h3>
    <div className={getElementClass('filters')}>
    {filterTypes.map((filterType, index) => {
      //Pick the correct component, based on type
      let Filter = null;

      switch(filterType.type) {
        case FILTER_TYPE_SELECT:
          Filter = SelectFilter;
          break;
        case FILTER_TYPE_MULTISELECT:
          Filter = MultiselectFilter;
          break;
        case FILTER_TYPE_NUMBER:
          Filter = NumberFilter;
          break;
        case FILTER_TYPE_DATE:
          Filter = DateFilter;
          break;
        case FILTER_TYPE_TEXT:
          Filter = TextFilter;
          break;
        default:
          debugger;
          throw new Error('Unknown filter type: '+filterType.type);
      }

      return <Filter
        localisation={localisation}
        key={filterType.name}
        filter={filterType}
        isActive={!!filtersSettings[index]}
        settings={filtersSettings[index]}
        clearFiltersSettings={() => {setFilterSettingsFor(index)(null)}}
        setEditingFilter={() => {
          setEditingFilterIndex(index);
          setIsModalOpen(true);
        }}
      />
    })}
    </div>
    <Modal
      isOpen={!!isModalOpen}
      contentLabel={editingFilter !== null ? <Text id={`filter-${editingFilter.name}-optionsLabel`} /> : ''}
      onRequestClose={() => {setIsModalOpen(false)}}
      onClosed={() => {setEditingFilterIndex(null);}}
      bg="dark"
      thin={true}
      onClick={(e) => {e.stopPropagation();}}
    >
      {editingFilter && <FilterOptions
        filter={editingFilter}
        settings={filtersSettings[editingFilterIndex]}
        setFilterSettings={(newFilterSettings) => {
          setFilterSettingsFor(editingFilterIndex)(newFilterSettings);
          setIsModalOpen(false)}}
      />}
    </Modal>
  </div>;
});

Filters.defaultProps = defaultProps;
Filters.propTypes = propTypes;
Filters.displayName = 'Filters';

export default Filters;



//Presentational components

//-Use the correct settings component based on filter type
const FilterOptions = (props) => {
  switch(props.filter.type) {
    case FILTER_TYPE_SELECT:
      return <SelectFilterOptions  {...props} />
    case FILTER_TYPE_MULTISELECT:
      return <MultiselectFilterOptions {...props} />
    case FILTER_TYPE_NUMBER:
      return <NumberFilterOptions {...props} />
    case FILTER_TYPE_DATE:
      return <DateFilterOptions {...props} />
    case FILTER_TYPE_TEXT:
      return <TextFilterOptions {...props} />
    default:
      throw new Error(`Unknown filter type: ${props.filter.type}`)
  }
}

function getFilterMethod(filterType, settings) {
  //allow user to override filtering behaviour with a custom method
  if(filterType.filterMethod instanceof Function) {
    return filter.filterMethod;
  }

  if(!settings) {//If not settings set, do not filter on this
    return null;
  }

  let filterMethod = null;

  switch(filterType.type) {
    case FILTER_TYPE_SELECT:
      filterMethod = SelectFilter.filterMethod;
      break;
    case FILTER_TYPE_MULTISELECT:
      filterMethod = MultiselectFilter.filterMethod;
      break;
    case FILTER_TYPE_NUMBER:
      filterMethod = NumberFilter.filterMethod;
      break;
    case FILTER_TYPE_DATE:
      filterMethod = DateFilter.filterMethod;
      break;
    case FILTER_TYPE_TEXT:
      filterMethod = TextFilter.filterMethod;
      break;
    default:
      throw new Error(`Unknown filter type: ${filterType.type}`)
  }

  return (object) => {
    return filterMethod(filterType.mapFilterProp(object, filterType, settings), filterType, settings);
  }
}

//Helpers methods
function combineFilters(filters) {
  return (obj) => {
    return filters.every((filter) => (filter(obj)));
  }
}
