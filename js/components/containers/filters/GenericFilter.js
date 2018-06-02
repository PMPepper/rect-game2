import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';


//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';


//Containers
import Text from '../Text';


//Filters
import {FILTER_TYPE_SELECT, FILTER_TYPE_MULTISELECT, FILTER_TYPE_NUMBER, FILTER_TYPE_DATE, FILTER_TYPE_TEXT} from './FilterTypes';


//The component
const GenericFilter = compose(
  BEMComponent('filter', {isActive: {type: PropTypes.bool, default: false}})
)(
  function FilterPresentational({localisation, filter, isActive, settings, clearFiltersSettings, setEditingFilter, baseClass, baseClassName, getElementClass, getAppliedContent, ...rest}) {
    return <div className={baseClass}>
      <button className={getElementClass(isActive ? 'editSettings' : 'applyFilter')} type="button" onClick={setEditingFilter}>
        {isActive ?
          [
            <span className="u-offscreen" key="applying"><Text id="filter-accessibility-applying" /></span>,
            getAppliedContent(filter, settings, localisation, rest),
            <span className="u-offscreen" key="clicktoEdit"><Text id="filter-accessibility-clicktoEdit" /></span>
          ]
          :
          [
            <i key="plus" className="fa fa-plus" aria-hidden="true"></i>,
            ' ',
            <Text key="applyText" id={`filter-${filter.name}-applyText`} />
          ]
        }
      </button>

      {isActive && <button className={getElementClass('clearSettings')} type="button" onClick={clearFiltersSettings}>
        <span className="u-offscreen"><Text id="filter-remove" /></span>
        <span className="u-offscreen">{getAppliedContent(filter, settings, localisation, rest)}</span>
        <i className="fa fa-times" aria-hidden="true"></i>
      </button>}
    </div>
  }
);

GenericFilter.displayName = 'GenericFilter';

GenericFilter.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([FILTER_TYPE_SELECT, FILTER_TYPE_MULTISELECT, FILTER_TYPE_NUMBER, FILTER_TYPE_DATE, FILTER_TYPE_TEXT]).isRequired
  }),
  isActive: PropTypes.bool.isRequired,
  clearFiltersSettings: PropTypes.func.isRequired,
  setEditingFilter: PropTypes.func.isRequired
};

export default GenericFilter;
