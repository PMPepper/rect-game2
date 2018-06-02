import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';
import PositionedItemComponent from '../highOrderComponents/PositionedItemComponent';
import FocusOnMountComponent from '../highOrderComponents/FocusOnMountComponent';
import PositionedToChildComponent from '../highOrderComponents/PositionedToChildComponent';

//Presentational
import Menu, {SPACER, isItemSelectable} from '../presentational/Menu';

//Helpers
import {mergeElementProps} from '../../helpers/React';

//Define the HOCs
const stripUnneededProps = ({x, y, setElement, portalElement,
  mId, contentWidth, contentHeight, positionX, positionY, positionWidth,
  positionHeight, element, setContentSize,
  ...rest
}) => (rest);


//The component
export default compose(
  BEMComponent('menu'),
  WithStateHandlersComponent(
    {
      selectedItems: [null]
    },
    {
      setSelectedItem: ({selectedItems}) => (selectedItemIndex, level, openChild = false) => {
        return {
          selectedItems: openChild ? //TODO only if valid?
            [...selectedItems.slice(0, level), selectedItemIndex, null]
            :
            [...selectedItems.slice(0, level), selectedItemIndex]
        }
      },
      closeCurrentLevel: ({selectedItems}) => () => {
        return {
          selectedItems: selectedItems.length > 1 ? [...selectedItems.slice(0, -1)] : selectedItems
        }
      },
      openSelectedItem: ({selectedItems}) => (selectFirstItem = false) => {
        return {
          selectedItems: [...selectedItems, selectFirstItem ? -1 : null]
        };
      }
    },
    {
      mapProps: ({elementProps, children, ...props}) => {
        const {selectedItems, setSelectedItem, openSelectedItem, closeCurrentLevel, doRequestClose, items} = props;
        const activeLevel = selectedItems.length - 1;

        const renderItemWithChildren = (children, item, showChildren, {level = 0}) => {
          return <SubContextMenu
            {...props}
            items={item.items}
            level={level+1}
            showPositionedElement={showChildren}
            renderItemWithChildren={renderItemWithChildren}
          >
            {children}
          </SubContextMenu>
        };

        return {
          ...props,
          renderItemWithChildren,
          elementProps: mergeElementProps(
            elementProps,
            {
              onContextMenu: (e) => {e.preventDefault();},
              onBlur: doRequestClose ? (e) => {doRequestClose()} : null,
              onKeyDown: (e) => {//Take keyboard input
                let activeItems = items;

                for(let i = 0; i < activeLevel; i++) {
                  activeItems = activeItems[selectedItems[i]].items;
                }

                const selectableItemIndexes = activeItems.reduce((arr, item, index) => {
                  if(isItemSelectable(item)) {
                    arr.push(index);
                  }

                  return arr;
                }, []);

                const selectedSelectableItemIndex = selectedItems[activeLevel] === null ?
                  null
                  :
                  selectedItems[activeLevel] === -1 ?
                    (selectableItemIndexes.length > 0 ? selectableItemIndexes[0] : null)
                    :
                    selectableItemIndexes.findIndex(value => (value === selectedItems[activeLevel]));

                const numSelectableItems = selectableItemIndexes.length;
                const selectedItem = activeItems[selectableItemIndexes[selectedSelectableItemIndex]];
                const selectedItemHasChildren = selectedItem ?
                  !selectedItem.disabled && selectedItem.items && selectedItem.items.length > 0
                  :
                  false;

                switch(e.which) {
                  case 37://left
                    if(activeLevel != 0) {//Close (if you're not level 0)
                      closeCurrentLevel && closeCurrentLevel();
                    }
                    break;
                  case 38://up
                    let newIndex = selectedSelectableItemIndex === null ? numSelectableItems - 1 : (selectedSelectableItemIndex-1);

                    if(newIndex < 0) {
                      newIndex = numSelectableItems - 1;
                    }

                    setSelectedItem && setSelectedItem(selectableItemIndexes[newIndex], activeLevel);
                    break;
                  case 39://right
                    if(selectedItemHasChildren) {
                      openSelectedItem && openSelectedItem(true);
                    }
                    break;
                  case 40://down
                    setSelectedItem && setSelectedItem(selectableItemIndexes[selectedSelectableItemIndex === null ? 0 : (selectedSelectableItemIndex+1) % numSelectableItems], activeLevel);
                    break;
                  case 27:
                    doRequestClose && doRequestClose();
                    break;
                  case 9://TAB
                    break;
                  case 13:
                    if(selectedItem) {
                      if(selectedItemHasChildren) {
                        openSelectedItem && openSelectedItem(true);
                      } else if(selectedItem.action) {
                        selectedItem.action();
                      }
                    }
                    break;
                  default:
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
              }
            }
          )
        };
      }
    }
  ),
  PositionedItemComponent({
    mapProps: stripUnneededProps
  }),
  FocusOnMountComponent({
    returnFocusOnUnmount: true
  })
)(Menu);

//The sub-menu items
const SubContextMenu = compose(
  PositionedToChildComponent({
    usePortal: false,
    mapPositionedItemProps: stripUnneededProps
  })
)(Menu);
