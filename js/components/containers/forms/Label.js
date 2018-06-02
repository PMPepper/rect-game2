import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';

//containers

//presentational
import Label from '../../presentational/forms/Label';

//vars
import {labelModifiers} from '../../../vars/FormModifiers';

export default compose(
  BEMComponent('form', labelModifiers)
)(Label);
