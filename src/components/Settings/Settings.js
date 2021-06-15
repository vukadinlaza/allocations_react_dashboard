import React, { useEffect, useState } from 'react';
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
import Users from './Users/Users'
import Investments from './Investments/Investments'


const styles = theme => ({
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

const Settings = ({ classes }) => {

  const [tabIndex, setTabIndex] = useState(0)
  const [selectWidth, setSelectWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState(25);
  const [searchFilter, setSearchFilter] = useState({});
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState();
  const [nestedKey, setNestedKey] = useState('');
  const [nestedCollection, setNestedCollection] = useState('');
  const [localFieldKey, setLocalFieldKey] = useState('');
  const [headers, setHeaders] = useState([])

  useEffect(() => {
    headers.forEach((header, i) => {
      const headerLength = header.label.length + 4;
      if(headerLength > selectWidth){
        setSelectWidth(headerLength)
      }
    });
  }, [headers])

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
    console.log({fieldHeader});
    //allowing search for nested keys
    if(fieldHeader.nestedKey && fieldHeader.nestedCollection && fieldHeader.localFieldKey){
      setNestedKey(fieldHeader.nestedKey)
      setNestedCollection(fieldHeader.nestedCollection)
      setLocalFieldKey(fieldHeader.localFieldKey)
    }else{
      // if you change the field from a nested one to a normal one (we dont want to keep the previous state)
      setNestedKey('')
      setNestedCollection('')
      setLocalFieldKey('')
    }
    setSortField(field)
  }

  const onChangeSort = (sortField, isAsc, nestedKey, nestedCollection, localFieldKey) => {
    let order = isAsc? 1 : -1
    if(nestedKey && nestedCollection && localFieldKey){
      setNestedKey(nestedKey)
      setNestedCollection(nestedCollection)
      setLocalFieldKey(localFieldKey)
    }
    setSortField(sortField);
    setSortOrder(order)
  }

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex);

    //clear state
    setCurrentPage(0)
    setPagination(25)
    setSearchFilter({})
    setSortField('')
    setSortOrder(1)
    setNestedKey('')
    setNestedCollection('')
    setLocalFieldKey('')
    document.getElementById('search-field').value = ''
  }


  const getCollection = () => {
    switch (tabIndex) {
      case 0:
        return(
          <Users
            classes={classes}
            searchFilter={searchFilter}
            setHeaders={setHeaders}
            pagination={pagination}
            currentPage={currentPage}
            sortField={sortField}
            sortOrder={sortOrder}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            onChangeSort={onChangeSort}
            />
        )
      case 1:
        return(
          <Investments
            classes={classes}
            searchFilter={searchFilter}
            setHeaders={setHeaders}
            pagination={pagination}
            currentPage={currentPage}
            sortField={sortField}
            sortOrder={sortOrder}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            onChangeSort={onChangeSort}
            nestedKey={nestedKey}
            nestedCollection={nestedCollection}
            localFieldKey={localFieldKey}
            />
        )
      default:
        <p>No data</p>
    }
  }

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
    {getCollection()}
  </div>
  );
}

export default withStyles(styles)(Settings);
