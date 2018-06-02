import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';

//containers

//presentational
import FieldInfo from '../../presentational/forms/FieldInfo';

//vars
import {infoModifiers} from '../../../vars/FormModifiers';

export default compose(
  BEMComponent('form', infoModifiers)
)(FieldInfo);
