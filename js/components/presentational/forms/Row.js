import React from 'react';
import PropTypes from 'prop-types';

//containers
import Label from '../../containers/forms/Label';


//Helpers
import {propTypes} from '../../highOrderComponents/BEMComponent';

export default function Row({baseClass, baseClassName, getElementClass, label, children, button = null}) {
  const {label: btnLabel = null, className: btnClassName = '', ...btnRest} = button || {};

  return <div className={getElementClass('row')}>
    <span className={getElementClass('labelHolder')}>
      {label}
      {/*tooltip?*/}
    </span>
    <span className={getElementClass('fieldHolder')}>
      {/*field prepend*/}
      {children}
      {button && <button {...btnRest} type="button" className={getElementClass('fieldBtn')+(btnClassName ? ` ${btnClassName}` : '')}>{btnLabel}</button>/*btn*/}
      {/*field append*/}
      {/*errors*/}
      {/*capslock warning*/}
      {/*field tooltip*/}
      {/*field info*/}
    </span>
  </div>
}

Row.propTypes = {
  ...propTypes,
  label: PropTypes.object//PropTypes.typeOf(Label)
};

/*
//import TooltipTrigger from '../display/TooltipTrigger';
//import Form from './Form'


//import IsCapslockOn from '../../components/highOrderComponents/IsCapslockOn';
//import Text from '../../components/containers/Text';

export default function Row ({definition, element, modifiers, formName, children, errors}) {
  return <div className={element('row', modifiers)}>
    <span className={element('labelHolder', modifiers)}>
      <label className={element('label', modifiers)} htmlFor={formName+"-"+definition.name}>
        {Form.renderFieldLabel(formName, definition)}
      </label>
      {definition.labelTooltip &&
        <TooltipTrigger {...definition.labelTooltip.props}><Text id={definition.labelTooltip.message} /></TooltipTrigger>
      }
    </span>
    <span className={element('fieldHolder', modifiers)}>
      {definition.fieldPrepend && definition.fieldPrepend({definition, element, modifiers, formName, children, errors})}
      {children}
      {definition.btn && renderFieldButton(definition.btn, element, modifiers)}
      {definition.fieldAppend && definition.fieldAppend({definition, element, modifiers, formName, children, errors})}
      {errors && errors.length > 0 &&
        <span className={element('errors')}>{errors.join(', ')}</span>
      }
      {definition.capslockWarning && <CapslockWarning element={element} />}
      {definition.fieldTooltip &&
        <TooltipTrigger {...definition.fieldTooltip.props}><Text id={definition.fieldTooltip.message} /></TooltipTrigger>
      }
      {definition.info &&
        <span className={element('info')}><Text id={definition.info} /></span>
      }
    </span>
  </div>
}

function renderFieldButton({name, ...rest}, element, modifiers) {
  return <button type="button" className={element('fieldBtn', modifiers)} {...rest}><Text id={name} /></button>
}

const CapslockWarning = IsCapslockOn()(({isCapslockOn, element}) => {
  return isCapslockOn ? <span className={element('capslockWarning')}>
    <i className={element('capslockWarning-icon')+' fa fa-exclamation-triangle'} aria-hidden="true"></i>
    <Text id="form-error-capslock-warning-short" className={element('capslockWarning-text')} aria-hidden="true" />
    <Text id="form-error-capslock-warning" role="alert" className="u-offscreen" />
  </span> : null
});
*/
