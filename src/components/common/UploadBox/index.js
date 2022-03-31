import React from 'react';
import { Typography, Paper, Button } from '@material-ui/core';
import { FaUpload } from 'react-icons/fa';
import useStyles from './styles';

const UploadBox = ({ children, width = '100%' }) => {
  const classes = useStyles(width);

  return (
    <Button className={classes.uploadButton} disableFocusRipple disableRipple component="label">
      <Paper className={classes.uploadBox} variant="outlined" square>
        <Typography className={classes.docPath}>
          <FaUpload size="1.2rem" />
          <span> </span>
          File upload here
          {children}
        </Typography>
      </Paper>
    </Button>
  );
};

export default UploadBox;
