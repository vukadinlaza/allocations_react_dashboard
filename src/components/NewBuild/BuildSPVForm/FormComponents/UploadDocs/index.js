import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import buildDoc from '../../../../../assets/buildDoc.svg';
import buildUpload from '../../../../../assets/buildUpload.svg';
import useStyles from '../../../BuildStyles';

export default function UploadDocs({ page, setPage }) {
  const classes = useStyles();
  const [iconsChecked, setIconsChecked] = useState({});
  const history = useHistory();
  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          Upload your documents{' '}
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please upload the appropriate documents so we have them on file for you. When uploading
          multiple files, please compress them into one zip folder.
        </Typography>
        <Paper
          className={classes.item}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, one: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Portfolio Company Term Sheet</Typography>
          <img
            src={buildUpload}
            className={classes.uploadIcon}
            style={{ opacity: iconsChecked.one ? '1' : '' }}
            alt="upload button"
          />
        </Paper>
        <Paper
          className={classes.item}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, two: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Pitch Deck</Typography>
          <img
            src={buildUpload}
            className={classes.uploadIcon}
            style={{ opacity: iconsChecked.two ? '1' : '' }}
            alt="upload button"
          />
        </Paper>
        <Paper
          className={classes.item}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, three: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Driver's License/Passport</Typography>
          <img
            src={buildUpload}
            className={classes.uploadIcon}
            style={{ opacity: iconsChecked.three ? '1' : '' }}
            alt="upload button"
          />
        </Paper>
        <Paper
          className={classes.item}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, four: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Portfolio Company Logo</Typography>
          <img
            src={buildUpload}
            className={classes.uploadIcon}
            style={{ opacity: iconsChecked.four ? '1' : '' }}
            alt="upload button"
          />
        </Paper>
        <Button
          className={classes.finishButton}
          onClick={() => {
            toast.success('Success! Your submission was submitted.');
            history.push('/');
          }}
        >
          Finish
        </Button>
        <Typography
          className={classes.previousButton}
          onClick={() => {
            setPage(page - 1);
          }}
        >
          Previous
        </Typography>
      </Paper>
    </>
  );
}
