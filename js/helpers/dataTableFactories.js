//TODO replace existing dataTableFactories with this

import React from 'react';
import {compose} from 'recompose';

//HOCs
import DataTableComponent from '../components/highOrderComponents/DataTableComponent';
import ResponsiveComponent from '../components/highOrderComponents/ResponsiveComponent';
import StackTableComponent from '../components/highOrderComponents/StackTableComponent';
import ContextMenuComponent from '../components/highOrderComponents/ContextMenuComponent';

//Containers

//Factories
import DataTableRow from '../components/factories/DataTableRow';
import DataTableRowExpandable, {makeExpandableColumns} from '../components/factories/DataTableRowExpandable';
import StackTableItem from '../components/factories/StackTableItem';
import StackTableItemExpandable from '../components/factories/StackTableItemExpandable';
import StackTableItemSelectable from '../components/factories/StackTableItemSelectable';

//Presentational
import {makeSelectableColumns} from '../components/presentational/DataTable';


function selectableExpandableColumnsTransform(columns) {
  return makeSelectableColumns(makeExpandableColumns(columns));
}

const ContextMenu = ContextMenuComponent();


export function makeListDataTable(
  name,
  columns,
  {
    dataTableColumnsTransform = null,
    smallWidthThreshold = 500,
    useTBody = true
  } = {}
) {
  const Row = ContextMenu(DataTableRow(dataTableColumnsTransform ? dataTableColumnsTransform(columns) : columns));

  //stack table item
  const Item = ContextMenu(StackTableItem(columns));

  const DataTable = compose(
    ResponsiveComponent(
      StackTableComponent(columns)(Item),
      ({outerWidth}) => {
        return outerWidth < smallWidthThreshold;
      }
    ),
    DataTableComponent(
      columns,
      {
        useTBody,
        dataTableColumnsTransform
      }
    )
  )(Row)


  DataTable.displayName = `${name}DataTable`;

  return DataTable
}


export function makeSelectableDataTable(
  name,
  columns,
  {
    dataTableColumnsTransform = null,
    smallWidthThreshold = 500,
    useTBody = true
  } = {}
) {
  dataTableColumnsTransform = dataTableColumnsTransform ?
    columns => (dataTableColumnsTransform(makeSelectableColumns(columns)))
    :
    makeSelectableColumns;

  //-row
  const Row = ContextMenu(DataTableRow(dataTableColumnsTransform(columns)));

  //stack table item
  const Item = ContextMenu(StackTableItemSelectable(columns));

  const DataTable = compose(
    ResponsiveComponent(
      StackTableComponent(columns)(Item),
      ({outerWidth}) => {
        return outerWidth < smallWidthThreshold;
      }
    ),
    DataTableComponent(
      columns,
      {
        useTBody,
        dataTableColumnsTransform
      }
    )
  )(Row)


  DataTable.displayName = `${name}SelectableDataTable`;

  return DataTable
}


export function makeExpandableDataTable(
  name,
  columns,
  getExpandedContent = DefaultExpandedContent,
  {
    dataTableColumnsTransform = null,
    smallWidthThreshold = 500,
    useTBody = false
  } = {}
) {
  dataTableColumnsTransform = dataTableColumnsTransform ?
    columns => (dataTableColumnsTransform(makeExpandableColumns(columns)))
    :
    makeExpandableColumns;

  //-row
  const Row = ContextMenu(DataTableRowExpandable(dataTableColumnsTransform(columns), getExpandedContent));

  //stack table item
  const Item = ContextMenu(StackTableItemExpandable(columns, getExpandedContent, StackTableItem(columns)));

  const DataTable = compose(
    ResponsiveComponent(
      StackTableComponent(columns)(Item),
      ({outerWidth}) => {
        return outerWidth < smallWidthThreshold;
      }
    ),
    DataTableComponent(
      columns,
      {
        useTBody,
        dataTableColumnsTransform
      }
    )
  )(Row)


  DataTable.displayName = `${name}ExpandableDataTable`;

  return DataTable
}




export function makeSelectableExpandableDataTable(
  name,
  columns,
  getExpandedContent = DefaultExpandedContent,
  {

    dataTableColumnsTransform = null,
    smallWidthThreshold = 500,
    useTBody = false
  } = {}
) {
  dataTableColumnsTransform = dataTableColumnsTransform ?
    columns => (dataTableColumnsTransform(selectableExpandableColumnsTransform(columns)))
    :
    selectableExpandableColumnsTransform;

  //-row
  let Row = ContextMenu(DataTableRowExpandable(dataTableColumnsTransform(columns), getExpandedContent));

  //stack table item
  let Item = ContextMenu(StackTableItemExpandable(columns, getExpandedContent, StackTableItemSelectable(columns)));

  const DataTable = compose(
    ResponsiveComponent(
      StackTableComponent(columns)(Item),
      ({outerWidth}) => {
        return outerWidth < smallWidthThreshold;
      }
    ),
    DataTableComponent(
      columns,
      {
        useTBody,
        dataTableColumnsTransform
      }
    )
  )(Row)


  DataTable.displayName = `${name}SelectableExpandableDataTable`;

  return DataTable
}

function DefaultExpandedContent(props) {
  return props.renderExpandedContent(props);
}
