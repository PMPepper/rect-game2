import React from 'react';
import PropTypes from 'prop-types';


//Others
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isReactRenderable, isValue} from '../../helpers/ExtendedPropTypes';


//Consts
export const SPACER = 'spacer';
const SPACER_MODIFIERS = {spacer: null};

//TODO change this:
//-stop being 'context menu' and just become 'menu'
//-fix the below:

//Not happy that the presentational component knows/cares about or controls:
//-bounds
//-keyboard input
//-the sub-context menus
//-focus on mount

//-only 'top level' context menu takes keyboard input


export default function Menu(props) {
  const {
    baseClass, baseClassName, getElementClass,
    items, level = 0, elementProps = null, renderItemWithChildren = null,
    selectedItems = [], setSelectedItem = null, openSelectedItem = null, closeCurrentLevel = null, doRequestClose = null
  } = props;

  let selectedItemIndex = selectedItems[level];

  if(selectedItemIndex === -1) {//-1 means select the first selectable item
    selectedItemIndex = items.findIndex(isItemSelectable);

    if(selectedItemIndex === -1) {
      selectedItemIndex = null;
    }
  }

  return <div
    {...elementProps}
    className={baseClass}
  >
    <ul className={getElementClass('list')}>
      {items.map((item, index) => {
        if(item === SPACER) {
          return <li key={index} className={getElementClass(['list', 'item'], SPACER_MODIFIERS)}></li>
        }

        const hasChildren = item.items && item.items.length > 0;
        const isSelectedItem = selectedItemIndex === index;
        const showChildren = hasChildren && isSelectedItem && selectedItems.length > level+1;

        const modifiers = {
          hasChildren: hasChildren ? null : undefined,
          showChildren: showChildren ? null : undefined,
          isSelectedItem: isSelectedItem ? null : undefined,
          disabled: item.disabled? null : undefined
        }

        const button = <div
          className={getElementClass('action', modifiers)}
          onClick={item.action && !hasChildren && !item.disabled ? (e) => {
            item.action();
            e.preventDefault();
          } : null}
        >
          <span className={getElementClass(['action', 'icon'], modifiers)}>{item.icon}</span>
          <span className={getElementClass(['action', 'label'], modifiers)}>{item.label}</span>
        </div>;

        return <li
          className={getElementClass(['list', 'item'], modifiers)}
          key={index}
          onMouseEnter={(!item.disabled && setSelectedItem) ? () => {
            !isSelectedItem && setSelectedItem(index, level, hasChildren);
          } : null}
          onMouseOver={(!item.disabled && setSelectedItem) ? () => {
            !isSelectedItem && setSelectedItem(index, level, hasChildren);
          } : null}
          onMouseLeave={(!item.disabled && setSelectedItem) ? () => {
            setSelectedItem(null, level);
          } : null}
        >
          {hasChildren && renderItemWithChildren ? renderItemWithChildren(button, item, showChildren, props) : button}
        </li>
      })}
    </ul>
  </div>
}


//Prop types
const itemPropType = PropTypes.shape({
  label: isReactRenderable.isRequired,
  icon: isReactRenderable,
  disabled: PropTypes.bool,
  action: PropTypes.func,
  //items: PropTypes.array//could implement proper recursive checking, but doesn't seem essential: https://stackoverflow.com/questions/32063297/can-a-react-prop-type-be-defined-recursively
})

const spacerPropType = isValue(SPACER);

Menu.propTypes = {
  ...propTypes,
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    itemPropType,
    spacerPropType
  ]))
};


//Helpers
export function isItemSelectable(item) {
  return item !== SPACER && !item.disabled
}
