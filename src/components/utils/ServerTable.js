import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import _ from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  InputAdornment,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AllocationsTable from './AllocationsTable';
import Loader from './Loader';
import { titleCase } from '../../utils/helpers';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '25px',
    background: 'white',
    padding: '15px 20px',
    border: 'solid 1px #dadada',
    boxShadow: '0px 3px 5px -5px',
    borderRadius: '3px',
  },
});

/* PROPS Needed (example)
tableVariables = {
  gqlQuery =`
  query MyQuery($pagination: PaginationInput!) {
  myQuery(pagination: $pagination) {
  _id
  }
  }`,
  headers = [
    { value: 'investor', label: 'Investor', isFilter: true, type: 'investor', nestedKey: 'email', nestedCollection: 'users', localFieldKey: 'user_id' },
    { value: 'deal', label: 'Deal', isFilter: true, type: 'deal', nestedKey: 'company_name', nestedCollection: 'deals', localFieldKey: 'deal_id' },
    { value: 'status', label: 'Status', isFilter: true },
    { value: 'amount', label: 'Amount', type: 'amount', align: 'right', isFilter: true },
    { value: 'editButton', label: 'Edit Button', type: 'edit button', keyNotInData: true}
  ],
  /// possible header fields: [
          value,
          label, 
          isFilter, 
          type,
          nestedKey,
          nestedCollection,
          localFieldKey,
          sortOrder,
          sortNestedCollection,
          sortLocalFieldKey,
          sortField]
  dataVariable = 'investmentsList', response from server data[dataVariable]
  defaultSortField = "status"
}
getCellContent={function} // get specific cell content to format it - optional
handleRowDetailPage={function} // route app on row click - optional
queryVariables={object} //optional
tablePagination={number} // optional
rowDetailPage={boolean} // optional
resetTableData={string} // optional - used for clearing sorting and filtering from one table to another
*/

const ServerTable = ({
  classes,
  tableVariables,
  getCellContent,
  handleRowDetailPage,
  queryVariables,
  tablePagination = 25,
  rowDetailPage = false,
}) => {
  const [selectWidth, setSelectWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState(tablePagination);
  const [searchFilter, setSearchFilter] = useState({});
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState();
  const [sortNestedKey, setSortNestedKey] = useState('');
  const [sortNestedCollection, setSortNestedCollection] = useState('');
  const [sortLocalFieldKey, setSortLocalFieldKey] = useState('');
  const [filterNestedKey, setFilterNestedKey] = useState('');
  const [filterNestedCollection, setFilterNestedCollection] = useState('');
  const [filterLocalFieldKey, setFilterLocalFieldKey] = useState('');
  const { headers, gqlQuery, dataVariable, defaultSortField, tableName } = tableVariables;

  const getCurrentSort = () => (!sortField ? defaultSortField : sortField);

  const { data, loading } = useQuery(
    gql`
      ${gqlQuery}
    `,
    {
      fetchPolicy: 'network-only',
      variables: {
        pagination: {
          pagination,
          currentPage,
          filterField: searchFilter.field,
          filterValue: searchFilter.searchFilter,
          filterNestedKey,
          filterNestedCollection,
          filterLocalFieldKey,
          sortField: getCurrentSort(),
          sortOrder,
          sortNestedKey,
          sortNestedCollection,
          sortLocalFieldKey,
        },
        ...queryVariables,
      },
    },
  );

  useEffect(() => {
    if (headers) {
      headers.forEach((header, i) => {
        const headerLength = header.label.length + 4;
        if (headerLength > selectWidth) {
          setSelectWidth(headerLength);
        }
      });
    }
  }, [headers]);

  useEffect(() => {
    // clear state (mostly for tabs parent components)
    setCurrentPage(0);
    setPagination(tablePagination);
    setSearchFilter({});
    setSortField('');
    setSortOrder(1);
    setSortNestedKey('');
    setSortNestedCollection('');
    setSortLocalFieldKey('');
    setFilterNestedKey('');
    setFilterNestedCollection('');
    setFilterLocalFieldKey('');
    // clear search bar
    const searchBarElement = document.getElementById('search-field');
    if (searchBarElement) searchBarElement.value = '';
  }, [headers, gqlQuery, dataVariable, defaultSortField, tableName]);

  const onChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setPagination(parseInt(event.target.value, 10));
  };

  const handleSearch = () => {
    // we retrieve this values like this so the refetch triggers when we click the search button
    const searchFilter = document.getElementById('search-field').value;
    const field = document.getElementById('field-filter').value;
    setCurrentPage(0);
    setSearchFilter({ searchFilter, field });

    const fieldHeader = headers.find((header) => header.value === field);
    // allowing search for nested keys
    if (fieldHeader.nestedKey && fieldHeader.nestedCollection && fieldHeader.localFieldKey) {
      setFilterNestedKey(fieldHeader.nestedKey);
      setFilterNestedCollection(fieldHeader.nestedCollection);
      setFilterLocalFieldKey(fieldHeader.localFieldKey);
    } else {
      // if you change the field from a nested one to a normal one (we dont want to keep the previous state)
      setFilterNestedKey('');
      setFilterNestedCollection('');
      setFilterLocalFieldKey('');
    }
  };

  const onChangeSort = (
    sortField,
    isAsc,
    sortNestedKey,
    sortNestedCollection,
    sortLocalFieldKey,
  ) => {
    const order = isAsc ? 1 : -1;
    if (sortNestedKey) {
      setSortNestedKey(sortNestedKey);
      if (sortNestedCollection && sortLocalFieldKey) {
        setSortNestedCollection(sortNestedCollection);
        setSortLocalFieldKey(sortLocalFieldKey);
      }
    } else {
      setSortNestedKey('');
      setSortNestedCollection('');
      setSortLocalFieldKey('');
    }
    setSortField(sortField);
    setSortOrder(order);
  };

  if (!data)
    return (
      <div className={classes.loaderContainer} style={{ padding: '30px', height: '300px' }}>
        <Loader />
      </div>
    );

  // const { isLastPage, count } = data.fundAdminTables;

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <FormControl variant="outlined" style={{ width: `${selectWidth}em` }} size="small">
          <InputLabel htmlFor="field-filter">Field</InputLabel>
          <Select
            native
            label="Field"
            inputProps={{
              id: 'field-filter',
            }}
          >
            {headers
              .filter((header) => header.isFilter)
              .map((header, index) => (
                <option value={header.value} key={`header-${index}`}>
                  {titleCase(header.label)}
                </option>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Search"
          id="search-field"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </InputAdornment>
            ),
          }}
          style={{ margin: '0 1em' }}
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          style={{ padding: '6px 35px' }}
        >
          Search
        </Button>
      </div>
      {loading ? (
        <div style={{ position: 'relative' }}>
          <div className={classes.loaderContainer}>
            <Loader />
          </div>
          <AllocationsTable
            data={Array(pagination).fill('')}
            headers={['']}
            serverPagination
            rowsQuantity={pagination}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <AllocationsTable
          data={_.get(data, dataVariable)}
          headers={headers}
          serverPagination
          rowsQuantity={pagination}
          currentPage={currentPage}
          isLastPage={data.fundAdminTables.isLastPage}
          count={data.fundAdminTables.count}
          includeCheckbox
          rowSelector="_id"
          rowDetailPage={rowDetailPage}
          handleRowDetailPage={handleRowDetailPage}
          getCellContent={getCellContent}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          getSortProps={onChangeSort}
          sortField={getCurrentSort()}
          sortOrder={sortOrder === 1 ? 'asc' : 'desc'}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(ServerTable);
