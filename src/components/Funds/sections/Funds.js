import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({

});

const Funds = ({ classes, history }) => {

  return (
    <div>
			Funds
    </div>
  );
};

export default withStyles(styles)(withRouter(Funds));
