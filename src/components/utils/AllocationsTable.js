import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
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
import { Box } from '@material-ui/core';
import { nWithCommas } from '../../utils/numbers';

const useStyles = makeStyles((theme) => ({
  cellText: {
    color: `${theme.colors.black[50]} !important`,
  },
  headerText: {
    color: `${theme.colors.black[50]} !important`,
    fontWeight: '400',
  },
  row: {
    '&:hover': {
      background: theme.colors.gray[100],
    },
  },
  selectedCheckbox: {
    color: theme.palette.primary.main,
  },
  tableContainer: {
    background: `${theme.colors.primary[25]} 0% 0% no-repeat padding-box`,
    boxShadow: `0px 3px 6px ${theme.colors.black[100]}29`,
    border: `1px solid ${theme.colors.gray[400]}40 !important`,
    borderRadius: '10px',
    overflowX: 'auto',
    padding: '20px 0',
  },
  table: {},
  totalRow: {
    background: theme.colors.white[100],
  },
  totalCell: {
    color: `${theme.colors.black[50]} !important`,
    fontWeight: '600 !important',
  },
}));

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
		onChangeRowsPerPage={this.onChangeRowsPerPage} optional

		includeCheckbox={Boolean} optional
		rowSelector="rowSelector" - property name that identifies each row Optional
		rowDetailPage={true} - true if when clicking on row takes you to row specific page optional
		handleRowDetailPage={this.handleDetailPage} - function to tell where to go when clickin on a row (only if rowDetailPage is true)

		withTitle={true} //add title to table - optional
		titleComponent={<div></div>} JSX that goes as the title - optional

		getSortProps={sortFunction} optional
		sortField="field" optional

		getCellContent={functionThatReturnsSpecifiedValueForCell} only needed it a type is provided in the header - optional
		** if something particular is needed for a column cells, like a button, just add the type property in the header.

    withCollapse={Boolean} //For collapsed rows
    getCollapsedContent = {function} // returns JSX
    rowSelector="rowSelector" - property name that identifies each row Optional 
    currentCollapsed={currentRowToShow}//must match row[rowSelector]

    withTotal={Boolean} //for a Total row
		const headersExample = [
      {
				value: 'cellValue',
				label: 'cellLabel',
				type: 'typeName', //only if something particular is needed for a cell
				keyNotInData: Boolean // only if content of a cell is not included in data, i.e  button
				align: 'right' optional
				alignHeader: Boolean optional
        isSortable: Boolean optional
				nestedKey: nested key optional (needs nestedCollection & localFieldKey)
				nestedCollection: String (collection for lookup) (needs nestedKey localFieldKey)
				localFieldKey: key in db collection (needs nestedKey and nestedCollection)
        totalValue: String optional // can be used to fill a cell with title text (i.e. "Total" or "Average")
        totalType: String optional (needs withTotal to be passed into AllocationsTable and needs totalColumn)
			}
    ]
*/

const AllocationsTable = ({
  data,
  headers,
  rowSelector,
  rowDetailPage,
  pagination = false,
  serverPagination,
  count,
  rowsQuantity = 25,
  currentPage = 0,
  onChangePage,
  onChangeRowsPerPage,
  handleRowDetailPage,
  noShadow = false,
  includeCheckBox,
  tableSize,
  getCellContent,
  getTotalContent,
  withTitle,
  titleComponent,
  getSortProps,
  sortField,
  sortOrder,
  getCollapsedContent,
  withCollapse,
  currentCollapsed,
  // withTotal,
}) => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsQuantity);
  const [orderBy, setOrderBy] = React.useState(sortField || headers[0].value);
  const [order, setOrder] = React.useState(sortOrder);
  const classes = useStyles();

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handleClick = (event, value) => {
    const selectedIndex = selected.indexOf(value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, value);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleRequestSort = (
    event,
    property,
    sortNestedKey,
    sortNestedCollection,
    sortLocalFieldKey,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    if (getSortProps) {
      getSortProps(property, !isAsc, sortNestedKey, sortNestedCollection, sortLocalFieldKey);
    }
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n, idx) => `${n.entity}-${idx}`);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    if (serverPagination) {
      onChangePage(newPage);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if (serverPagination) {
      onChangeRowsPerPage(event);
    }
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDetailPage = (event, rowId) => {
    if (rowDetailPage) {
      handleRowDetailPage(rowId);
    }
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

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const isAllSelected = () => (data ? selected.length === data.length : false);
  let dataToShow = stableSort(data, getComparator(order, orderBy));

  // temp demo data
  const withTotal = true;

  if (pagination) {
    dataToShow = dataToShow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }
  return (
    <div className={classes.root} style={{ width: '100%' }}>
      <TableContainer
        component={Paper}
        style={noShadow ? { boxShadow: 'none', padding: '0' } : { padding: '0' }}
        className={classes.tableContainer}
      >
        {withTitle ? <Toolbar className={classes.toolbar}>{titleComponent}</Toolbar> : ''}
        <Table className={classes.table} size={tableSize || 'medium'} aria-label="simple table">
          <TableHead>
            <TableRow>
              {includeCheckBox ? (
                <TableCell align="center" padding="checkbox">
                  <Checkbox
                    checked={isAllSelected()}
                    onClick={(event) => handleSelectAllClick(event)}
                    icon={<RadioButtonUncheckedOutlinedIcon fontSize="small" />}
                    checkedIcon={
                      <FiberManualRecordIcon
                        fontSize="small"
                        className={classes.selectedCheckbox}
                      />
                    }
                  />
                </TableCell>
              ) : null}
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
                      active={header.isSortable ? orderBy === header.value : false}
                      direction={orderBy === header.value ? order : 'asc'}
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
                      data="table-sort"
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length
              ? dataToShow.map((row, idx) => {
                  const isItemSelected = isSelected(`${row[rowSelector]}-${idx}`);
                  return (
                    <React.Fragment key={`row-${idx}`}>
                      <TableRow
                        key={`${row.entity}-${idx}`}
                        className={classes.row}
                        style={rowDetailPage ? { cursor: 'pointer' } : {}}
                        onClick={(e) => handleDetailPage(e, row)}
                      >
                        {includeCheckBox ? (
                          <TableCell align="center" padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onClick={(event) => handleClick(event, `${row[rowSelector]}-${idx}`)}
                              inputProps={{ 'aria-labelledby': `${row[rowSelector]}-${idx}` }}
                              icon={<RadioButtonUncheckedOutlinedIcon fontSize="small" />}
                              checkedIcon={
                                <FiberManualRecordIcon
                                  fontSize="small"
                                  className={classes.selectedCheckbox}
                                />
                              }
                            />
                          </TableCell>
                        ) : null}
                        {headers && headers.length
                          ? headers.map((header, i) =>
                              Object.keys(row).includes(header.value) || header.keyNotInData ? (
                                <TableCell
                                  key={`${header.value}-${i}`}
                                  component="th"
                                  scope="row"
                                  className={classes.cellText}
                                  id={`${row[rowSelector]}-${idx}`}
                                  align={header.align}
                                >
                                  {header.type
                                    ? getCellContent(
                                        header.type,
                                        row,
                                        header.value,
                                        row[rowSelector],
                                      )
                                    : _.get(row, header.value, '')}
                                </TableCell>
                              ) : (
                                <TableCell key={`${header.value}-${i}`} />
                              ),
                            )
                          : null}
                      </TableRow>

                      {withCollapse ? (
                        <TableRow>
                          <TableCell style={{ padding: 0 }} colSpan={headers.length}>
                            <Collapse
                              in={currentCollapsed.includes(row[rowSelector])}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={1}>{getCollapsedContent(row)}</Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </React.Fragment>
                  );
                })
              : null}
          </TableBody>

          {withTotal ? (
            <TableRow className={classes.totalRow}>
              {headers.map((header) => {
                if (header.totalValue) {
                  return (
                    <TableCell classes={{ root: classes.totalCell }}>{header.totalValue}</TableCell>
                  );
                }
                if (header.totalType) {
                  return (
                    <TableCell
                      classes={{ root: classes.totalCell }}
                      align={header.align || 'center'}
                    >
                      {nWithCommas(getTotalContent(header.totalType, dataToShow, header.value))}
                    </TableCell>
                  );
                }
                return <TableCell classes={{ root: classes.totalCell }} />;
              })}
            </TableRow>
          ) : null}
        </Table>
        {pagination || serverPagination ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count || 0}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from} - ${to} of ${nWithCommas(count)}`;
            }}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : (
          ''
        )}
      </TableContainer>
    </div>
  );
};

export default AllocationsTable;
