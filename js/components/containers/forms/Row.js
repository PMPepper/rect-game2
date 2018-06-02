import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../../highOrderComponents/BEMComponent';

//containers

//presentational
import Row from '../../presentational/forms/Row';

//vars
import {rowModifiers} from '../../../vars/FormModifiers';

export default compose(
  BEMComponent('form', rowModifiers)
)(Row);
