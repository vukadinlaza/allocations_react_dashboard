import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  InputAdornment,
  Tabs,
  Tab,
  Paper
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { getTabVariables } from './tabsVariables';
import AllocationsTable from '../utils/AllocationsTable';
import Loader from '../utils/Loader';
import { nWithCommas } from '../../utils/numbers'


const styles = theme => ({
  loaderContainer: {
    position:"absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "25px",
    background: "white",
    padding: "15px 20px",
    border: "solid 1px #dadada",
    boxShadow: "0px 3px 5px -5px",
    borderRadius: "3px"
  },
  tab: {
    textTransform: 'none',
    '&:focus': {
      outline: "none"
    }
  }
});

const tabs = ['Users', 'Investments']

const Settings = ({ classes, history }) => {

  const [tabIndex, setTabIndex] = useState(0)
  const [tabVariables, setTabVariables] = useState(getTabVariables(tabIndex))
  const [searchFilter, setSearchFilter] = useState({});
  const [selectWidth, setSelectWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState(25);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState();
  const [sortNestedKey, setSortNestedKey] = useState('');
  const [sortNestedCollection, setSortNestedCollection] = useState('');
  const [sortLocalFieldKey, setSortLocalFieldKey] = useState('');
  const [filterNestedKey, setFilterNestedKey] = useState('');
  const [filterNestedCollection, setFilterNestedCollection] = useState('');
  const [filterLocalFieldKey, setFilterLocalFieldKey] = useState('');
  const { headers, gqlQuery, dataVariable, defaultSortField } = tabVariables;

  const getCurrentSort = () => (!sortField? defaultSortField : sortField)

  const { data, loading } = useQuery(gql`${gqlQuery}`,
    {
      variables: {
        pagination: {
          pagination,
          currentPage,
          filterField: searchFilter.field ,
          filterValue: searchFilter.searchFilter,
          filterNestedKey,
          filterNestedCollection,
          filterLocalFieldKey,
          sortField: getCurrentSort(),
          sortOrder,
          sortNestedKey,
          sortNestedCollection,
          sortLocalFieldKey
        }
      }
    }
  );

  useEffect(() => {
    if(headers){
      headers.forEach((header, i) => {
        const headerLength = header.label.length + 4;
        if(headerLength > selectWidth){
          setSelectWidth(headerLength)
        }
      });
    }
  }, [headers, selectWidth])

  const onChangePage = (newPage) => {
    setCurrentPage(newPage);
  }

  const onChangeRowsPerPage = (event) => {
    setPagination(parseInt(event.target.value, 10))
  }

  const handleSearch = () => {
    // we retrieve this values like this so the refetch triggers when we click the search button
    let searchFilter = document.getElementById('search-field').value
    let field = document.getElementById('field-filter').value
    setCurrentPage(0);
    setSearchFilter({searchFilter, field});

    const fieldHeader = headers.find(header => header.value === field);
    //allowing search for nested keys
    if(fieldHeader.nestedKey && fieldHeader.nestedCollection && fieldHeader.localFieldKey){
      setFilterNestedKey(fieldHeader.nestedKey)
      setFilterNestedCollection(fieldHeader.nestedCollection)
      setFilterLocalFieldKey(fieldHeader.localFieldKey)
    }else{
      // if you change the field from a nested one to a normal one (we dont want to keep the previous state)
      setFilterNestedKey('')
      setFilterNestedCollection('')
      setFilterLocalFieldKey('')
    }
  }

  const onChangeSort = (sortField, isAsc, sortNestedKey, sortNestedCollection, sortLocalFieldKey) => {
    let order = isAsc? 1 : -1
    if(sortNestedKey && sortNestedCollection && sortLocalFieldKey){
      setSortNestedKey(sortNestedKey)
      setSortNestedCollection(sortNestedCollection)
      setSortLocalFieldKey(sortLocalFieldKey)
    }else{
      setSortNestedKey('')
      setSortNestedCollection('')
      setSortLocalFieldKey('')
    }
    setSortField(sortField);
    setSortOrder(order)
  }

  const handleChangeTab = (event, newIndex) => {
    const tabVariables = getTabVariables(newIndex)
    setTabIndex(newIndex);
    setTabVariables(tabVariables)
    //clear state
    setCurrentPage(0)
    setPagination(25)
    setSearchFilter({})
    setSortField('')
    setSortOrder(1)
    setSortNestedKey('')
    setFilterNestedCollection('')
    setSortLocalFieldKey('')
    setFilterNestedKey('')
    setFilterNestedCollection('')
    setFilterLocalFieldKey('')
    document.getElementById('search-field').value = ''
  }

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'investor':
        return (row[headerValue]? row[headerValue].email : 'No email found')
      case 'deal':
        return (row[headerValue]? row[headerValue].company_name : 'No company found')
      case 'amount':
        return nWithCommas(row[headerValue])
      case 'count':
        return row[headerValue].length
      case 'link':
        return <a href={`/investor/${row._id}/home`}>Link</a>
      default:
        return <div></div>
    }
  }

  const handleRowDetailPage = (row) => {
    switch (tabIndex) {
      case 0:
        history.push(`/admin/users/${row._id}`)
        break;
      case 1:
        history.push(`/admin/invesments/${row._id}`)
        break
      default:
        return
    }
  }

  if (!data) return <Loader />;

  return (
    <div className={classes.root}>
      <Paper square>
        <Tabs
          value={tabIndex}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          >
          {tabs.map((tab, index) =>
            <Tab label={tab} key={`tab-${index}`} className={classes.tab}/>
          )}
        </Tabs>
      </Paper>

      <div className={classes.searchContainer}>
        <FormControl variant="outlined" style={{width: `${selectWidth}em`}} size="small">
          <InputLabel htmlFor="field-filter">Field</InputLabel>
          <Select
            native
            label="Field"
            inputProps={{
              id: 'field-filter',
            }}
            >
            {headers.filter(header => header.isFilter).map((header, index) =>
              <option value={header.value} key={`header-${index}`}>{header.label}</option>
            )}
          </Select>
        </FormControl>
        <TextField
          label="Search"
          id="search-field"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">
            <SearchIcon style={{color: "rgba(0, 0, 0, 0.54)"}}/>
          </InputAdornment>,
        }}
        style={{margin: "0 1em"}}
        />
      <Button
        onClick={handleSearch}
        variant="contained"
        color="primary"
        style={{padding: "6px 35px"}}
        >
        Search
      </Button>
    </div>
    {loading?
      <div style={{position: "relative"}}>
        <div className={classes.loaderContainer}>
          <Loader/>
        </div>
        <AllocationsTable
          data={Array(pagination).fill('')}
          headers={['']}
          serverPagination={true}
          rowsQuantity={pagination}
          currentPage={currentPage}
          />
      </div>
      :
      <AllocationsTable
        data={data[dataVariable]}
        headers={headers}
        serverPagination={true}
        rowsQuantity={pagination}
        currentPage={currentPage}
        includeCheckbox={true}
        rowSelector="_id"
        rowDetailPage={true}
        handleRowDetailPage={handleRowDetailPage}
        getCellContent={getCellContent}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        getSortProps={onChangeSort}
        sortField={getCurrentSort()}
        />
    }
  </div>
  );
}

export default withStyles(styles)(withRouter(Settings));
