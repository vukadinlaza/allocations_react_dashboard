import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Collapse from '@material-ui/core/Collapse';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Box } from '@material-ui/core';
import { nWithCommas } from '../../utils/numbers';

const styles = (theme) => ({
  cellText: {
    color: '#2A2B54 !important',
    padding: '15px 16px',
  },
  headerLabel: {
    fontSize: '12px',
    fontWeight: 700,
  },
  headerText: {
    color: '#2A2B54 !important',
    fontWeight: '400',
    border: 'none',
  },
  paginationArrows: {
    background: '#FFFFFF',
    border: '1px solid #CBD5E1',
    padding: '11px 12px',
    height: '100%',
    margin: '0',
    display: 'inline-block',
    color: '#64748B',
    cursor: 'pointer',
  },
  paginationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    margin: '24px 0',
  },
  paginationCount: {
    background: '#FFFFFF',
    borderTop: '1px solid #CBD5E1',
    borderBottom: '1px solid #CBD5E1',
    borderRadius: '0px',
    padding: '11px 24px',
    height: '100%',
    margin: '0',
    display: 'inline-block',
    color: '#64748B',
  },
  paginationText: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#64748B',
    marginBottom: '16px',
  },
  row: {
    background: '#FFFFFF',
    '&:hover': {
      background: '#f1f4fb',
    },
  },
  selectedCheckbox: {
    color: theme.palette.primary.main,
  },
  tableContainer: {
    borderRadius: '10px',
    overflowX: 'auto',
    padding: '20px 0',
    background: 'rgba(0,0,0,0)',
    border: 'none',
    boxShadow: 'none !important',
  },
  table: {
    borderCollapse: 'separate',
    borderSpacing: '0px 8px',
  },
  tableHead: {
    background: 'rgba(0,0,0,0)',
  },
  totalRow: {
    background: '#FFFFFF',
  },
  totalCell: {
    color: '#2A2B54 !important',
    fontWeight: '600 !important',
  },
});

/*
  PROPS NEEDED (example):
    data={tableData}
    headers={tableHeaders}
    tableSize="small" optional

    pagination={Boolean} optional
    serverPagination={Boolean} optional
    rowsQuantity={10} optional
    currentPage={0} optional
    onChangePage={this.onChangePage} optional

    getSortProps={sortFunction} optional
    sortField="field" optional

    getCellContent={functionThatReturnsSpecifiedValueForCell} only needed it a type is provided in the header - optional
    ** if something particular is needed for a column cells, like a button, just add the type property in the header.


    const headersExample = [
      {
        value: 'cellValue',
        label: 'cellLabel',
        type: 'typeName', //only if something particular is needed for a cell
        keyNotInData: Boolean // only if content of a cell is not included in data, i.e  button
        align: 'right' optional
        alignHeader: Boolean optional
        isSortable: Boolean optional
      }
    ]
*/

const AllocationsTable = ({
  classes,
  data,
  headers,
  pagination = false,
  currentPage = 0,
  tableSize = '',
  getCellContent,
  getSortedData,
  sortField = '',
  sortOrder = 'asc',
  listOf = '',
  rowsPerPage = 10,
}) => {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = React.useState(sortField || headers[0].value);
  const [order, setOrder] = React.useState(sortOrder);
  const from = page * rowsPerPage + 1;
  const to = page * rowsPerPage + rowsPerPage;

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    const noMorePages = data.length < newPage * rowsPerPage + 1;
    if (newPage < 0 || noMorePages) return;
    setPage(newPage);
  };

  const descendingComparator = (a, b, orderBy) => {
    const itemA = _.get(a, orderBy, '');
    const itemB = _.get(b, orderBy, '');
    if (itemB < itemA) {
      return -1;
    }
    if (itemB > itemA) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getCellStyle = (index) => {
    const lastColumn = headers.length - 1 === index;
    const cellStyle = {
      border: 'none',
    };

    if (lastColumn) cellStyle.borderRadius = '0px 8px 8px 0px';
    if (index === 0) cellStyle.borderRadius = '8px 0px 0px 8px';

    return cellStyle;
  };

  const sortByHeader = headers.find((h) => h.value === orderBy);
  let dataToShow = sortByHeader.customSort
    ? getSortedData(data, orderBy, order)
    : stableSort(data, getComparator(order, orderBy));

  if (pagination) {
    dataToShow = dataToShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }
  return (
    <div className={classes.root} style={{ width: '100%' }}>
      <TableContainer component={Paper} style={{ padding: '0' }} className={classes.tableContainer}>
        <Table className={classes.table} size={tableSize || 'medium'} aria-label="simple table">
          <TableHead className={classes.tableHead}>
            <TableRow>
              {headers &&
                headers.length &&
                headers.map((header, index) => (
                  <TableCell
                    key={`${header.label}-${index}`}
                    className={classes.headerText}
                    sortDirection={orderBy === header.value ? order : false}
                    align={header.alignHeader ? header.align : 'center'}
                  >
                    <TableSortLabel
                      className={classes.headerLabel}
                      active={header.isSortable ? orderBy === header.value : false}
                      direction={orderBy === header.value ? order : 'asc'}
                      IconComponent={ArrowDropDownIcon}
                      onClick={(e) => {
                        if (header.isSortable) {
                          handleRequestSort(
                            e,
                            header.value,
                            header.nestedKey,
                            header.nestedCollection,
                            header.localFieldKey,
                          );
                        }
                      }}
                    >
                      {header.label.toUpperCase()}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length
              ? dataToShow.map((row, idx) => {
                  return (
                    <React.Fragment key={`row-${idx}`}>
                      <TableRow key={`${row.entity}-${idx}`} className={classes.row}>
                        {headers && headers.length
                          ? headers.map((header, i) =>
                              Object.keys(row).includes(header.value) || header.keyNotInData ? (
                                <TableCell
                                  key={`${header.value}-${i}`}
                                  component="th"
                                  scope="row"
                                  className={classes.cellText}
                                  style={getCellStyle(i)}
                                  align={header.align}
                                >
                                  {header.type
                                    ? getCellContent(header.type, row, header.value)
                                    : _.get(row, header.value, '')}
                                </TableCell>
                              ) : (
                                <TableCell key={`${header.value}-${i}`} />
                              ),
                            )
                          : null}
                      </TableRow>
                    </React.Fragment>
                  );
                })
              : null}
          </TableBody>
        </Table>
        {pagination && (
          <div className={classes.paginationContainer}>
            <p className={classes.paginationText}>
              Showing {from} to {to} of {nWithCommas(data.length)} {listOf}
            </p>
            <div style={{ height: '48px' }}>
              <span
                className={classes.paginationArrows}
                style={{ borderRadius: '8px 0px 0px 8px' }}
                onClick={(e) => handleChangePage(e, page - 1)}
              >
                <ChevronLeftIcon />
              </span>
              <span className={classes.paginationCount}>
                {from} of {to}
              </span>
              <span
                className={classes.paginationArrows}
                style={{ borderRadius: '0px 8px 8px 0px' }}
                onClick={(e) => handleChangePage(e, page + 1)}
              >
                <ChevronRightIcon />
              </span>
            </div>
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default withStyles(styles)(AllocationsTable);
