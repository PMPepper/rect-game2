import React from 'react';
import PropTypes from 'prop-types';

//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isPositiveInteger} from '../../helpers/ExtendedPropTypes';

//TODO transitions
//TODO keyboard input
//TODO full accessibility
//https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
//https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html

export default function TabsAccordion({baseClass, baseClassName, getElementClass, id, children, selectedIndex = 0, setSelectedIndex = null, accordion = false}) {

  return <div className={baseClass} id={id}>
    {!accordion && <ol className={getElementClass('tabs')} role="tablist">{React.Children.map(children, (child, index) => {
      const isSelectedIndex = index === selectedIndex;
      const {label, name, ...childProps} = child.props;
      const modifiers = {
        selected: isSelectedIndex ? null : undefined
      };

      return <li
        className={getElementClass(['tabs', 'item'], modifiers)}
        key={name}
        role="presentational"
      >
        <button
          className={getElementClass('tab', modifiers)}
          role="tab"
          aria-selected={isSelectedIndex}
          aria-controls={`${id}-${name}-contents`}
          id={`${id}-${name}-label`}
          onClick={() => {
            setSelectedIndex && setSelectedIndex(index)
          }}
        >
          {label}
        </button>
      </li>
    })}</ol>}

    {React.Children.map(children, (child, index) => {
      const isSelectedIndex = index === selectedIndex;
      const {label, name, ...childProps} = child.props;
      const modifiers = {
        selected: isSelectedIndex ? null : undefined
      };

      return [
        accordion && <div
          className={getElementClass('heading', modifiers)}
          role="heading"
          aria-level="3"
          key={`${id}-${name}`}
        >
          <button
            className={getElementClass('trigger', modifiers)}
            aria-expanded={isSelectedIndex}
            aria-controls={`${id}-${name}-contents`}
            id={`${id}-${name}-label`}
            aria-disabled={!isSelectedIndex}
            type="button"
            onClick={() => {
              setSelectedIndex && setSelectedIndex(index)
            }}
          >
            {label}
          </button>
        </div>,
        isSelectedIndex && <div
          className={getElementClass('contents', modifiers)}
          id={`${id}-${name}-contents`}
          role="region"
          aria-labelledby={`${id}-${name}-label`}
        >
          {React.createElement(child.type, childProps)}
        </div>
      ];
    })}
  </div>
}

TabsAccordion.propTypes = {
  ...propTypes,
  id: PropTypes.string.isRequired,
  selectedIndex: isPositiveInteger,
  setSelectedIndex: PropTypes.func,
  accordion: PropTypes.bool
};
