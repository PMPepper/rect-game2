import React from 'react';
import {compose} from 'recompose';


//HOCs
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';

//Helpers
import {cloneElementWithElementProps} from '../../helpers/React';

//TODO pass bounds to children (if applicable)

export default compose(
  WithStateHandlersComponent(
    {
      windowingManagerSequence: []
    },
    {
      windowingManagerBringToFront: ({windowingManagerSequence}) => (index) => {
        return {
          windowingManagerSequence: ((index + 1) === windowingManagerSequence.length) ?
            windowingManagerSequence
            :
            [...windowingManagerSequence.slice(0, index), ...windowingManagerSequence.slice(index+1), windowingManagerSequence[index]]
        };
      }
    },
    {
      withPropsOnChange: [
        ['children'],
        ({children, windowingManagerSequence}) => {
          const knownKeys = new Set(windowingManagerSequence);
          const newSequence = [...windowingManagerSequence];

          let hasChanged = false;

          React.Children.toArray(children).forEach((child, index) => {
            const key = child.key || 'windowingmanager___'+index;

            if(!knownKeys.has(key)) {
              //Add new children to the end, so they are at the top
              newSequence.push(key);
              hasChanged = true;
            } else {
              //remove entries from knownKeys as we go...
              knownKeys.delete(key);
            }
          });

          //So now, the only things left in knownKeys are children that are no longer present
          knownKeys.forEach(key => {
            //remove everything that's left from 'newSequence' and record that the sequence has changed
            hasChanged = true;
            newSequence.splice(newSequence.indexOf(key), 1);
          })

          if(hasChanged) {
            //And return the new sequence
            return {
              windowingManagerSequence: newSequence
            };
          }
        }
      ]
    }
  )
)(function WindowingComponent({children, windowingManagerSequence, windowingManagerBringToFront, boundsX, boundsY, boundsWidth, boundsHeight}) {
  const childArr = React.Children.toArray(children);
  const keyToChildMap = {};
  const bounds = {
    boundsX, boundsY, boundsWidth, boundsHeight
  }


  //map children by their keys
  childArr.forEach((child, index) => {
    const key = child.key || 'windowingmanager___'+index;

    keyToChildMap[key] = child;
  });

  return windowingManagerSequence.map((key, index) => {
    const child = keyToChildMap[key];
    const childElementProps = {
      onFocus: (e) => {
        //TODO what about keyboard input?
        console.log('onFocus', e.target);
      },
      onMouseDown: (e) => {
        windowingManagerBringToFront(index);
      }
    };

    return cloneElementWithElementProps(child, childElementProps, bounds);
  })
});
