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
import Loader from '../utils/Loader';
import Users from './Users'


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
  const [sortOrder, setSortOrder] = useState()
  const [headers, setHeaders] = useState([])

  useEffect(() => {
    headers.forEach((header, i) => {
      const headerLength = header.value.length;
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
    let searchFilter = document.getElementById('search-field').value
    let field = document.getElementById('field-filter').value
    setCurrentPage(0);
    setSearchFilter({searchFilter, field});
  }

  const onChangeSort = (sortField, isAsc) => {
    let order = isAsc? 1 : -1
    setSortField(sortField);
    setSortOrder(order)
  }

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex)
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
      case 0:
        return(
          <div></div>
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
        <FormControl variant="outlined" style={{width: `${selectWidth + 2}em`}} size="small">
          <InputLabel htmlFor="field-filter">Field</InputLabel>
          <Select
            native
            label="Field"
            inputProps={{
              id: 'field-filter',
            }}
            >
            {headers.map((header, index) =>
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
