import React from 'react';
import PropTypes from 'prop-types';

//Containers
import Text from '../containers/Text';

//Presentational
import Icon from '../presentational/Icon';


//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isReactComponent, isReactRenderable, isPositiveNumber} from '../../helpers/ExtendedPropTypes';
import {mergeElementProps} from '../../helpers/React';


//This component is Pure
export default function Panel({
  baseClass, baseClassName, getElementClass,
  children, title = null, headOptions = null,
  component: Component = 'article', titleComponent: TitleComponent = 'h3', headProps = null, minHeight = null,
  elementProps = null
}) {
  //TODO component might not be html, should check and apply generic params differently if it isn't
  return <Component
    {...mergeElementProps(elementProps, {
      style: minHeight === null ? null : {minHeight: `${minHeight}px`},
      className: baseClass+(elementProps && elementProps.className ? ' '+elementProps.className : '')
    })}
  >
    <div className={getElementClass('head')} {...headProps}>
      {title && <TitleComponent className={getElementClass('title')}>{title}</TitleComponent>}
      {headOptions && headOptions.length > 0 && <span className={getElementClass(['head', 'options'])}>{headOptions.map(headOption => {
        return <button key={headOption.key} className={getElementClass(['head', 'options', 'btn'])} onClick={headOption.onClick} onMouseDown={e => {e.stopPropagation();}}>
          <Icon icon={headOption.icon} />
          {headOption.label && <span className="u-offscreen">{headOption.label}</span>}
        </button>
      })}</span>}
    </div>
    <div className={getElementClass('body')}>
      {children}
    </div>
    {/*Buttons?*/}
  </Component>
}

const headOptionShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  //icon: ,//TODO icon shape
  onClick: PropTypes.func,
  label: isReactRenderable
})

Panel.propTypes = {
  ...propTypes,
  elementProps: PropTypes.object,
  title: isReactRenderable,
  headerOptions: isReactRenderable,
  component: isReactComponent,
  titleComponent: isReactComponent,
  minHeight: isPositiveNumber
};
