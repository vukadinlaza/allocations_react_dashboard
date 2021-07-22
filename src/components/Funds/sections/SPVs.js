import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { InputAdornment, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AllocationsTable from '../../utils/AllocationsTable';

const styles = (theme) => ({});

const SPVs = ({ classes, history }) => {
  return (
    <div>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          placeholder="Search by fund name"
          id="search-field"
          fullWidth
          // onChange={handleSearch}
          // value={searchTerm || ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </InputAdornment>
            ),
          }}
          style={{ margin: '0 1em' }}
        />
      </div>
      SPVs Table
      {/* <AllocationsTable /> */}
    </div>
  );
};

export default withStyles(styles)(withRouter(SPVs));
