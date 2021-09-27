import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import buildDoc from '../../../../../assets/buildDoc.svg';
import buildUpload from '../../../../../assets/buildUpload.svg';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';

import useStyles from '../../../BuildStyles';

export default function UploadDocs({ page, setPage, deal }) {
  console.log('DEAL', deal);
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
          className={`${classes.item} ${!iconsChecked.one ? '' : classes.selected}`}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, one: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Portfolio Company Term Sheet</Typography>
          {!iconsChecked.one ? (
            <img
              src={buildUpload}
              className={classes.uploadIcon}
              style={{ opacity: iconsChecked.one ? '1' : '' }}
              alt="upload button"
            />
          ) : (
            <img
              src={CheckCircle}
              className={classes.checkCircle}
              alt="checkbox"
              style={{ opacity: '1' }}
            />
          )}
        </Paper>
        <Paper
          className={`${classes.item} ${!iconsChecked.two ? '' : classes.selected}`}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, two: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Pitch Deck</Typography>
          {!iconsChecked.two ? (
            <img
              src={buildUpload}
              className={classes.uploadIcon}
              style={{ opacity: iconsChecked.two ? '1' : '' }}
              alt="upload button"
            />
          ) : (
            <img
              src={CheckCircle}
              className={classes.checkCircle}
              alt="checkbox"
              style={{ opacity: '1' }}
            />
          )}
        </Paper>
        <Paper
          className={`${classes.item} ${!iconsChecked.three ? '' : classes.selected}`}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, three: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Driver's License/Passport</Typography>
          {!iconsChecked.three ? (
            <img
              src={buildUpload}
              className={classes.uploadIcon}
              style={{ opacity: iconsChecked.three ? '1' : '' }}
              alt="upload button"
            />
          ) : (
            <img
              src={CheckCircle}
              className={classes.checkCircle}
              alt="checkbox"
              style={{ opacity: '1' }}
            />
          )}
        </Paper>
        <Paper
          className={`${classes.item} ${!iconsChecked.four ? '' : classes.selected}`}
          onClick={() => {
            setIconsChecked((prev) => {
              return { ...prev, four: true };
            });
          }}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Portfolio Company Logo</Typography>
          {!iconsChecked.four ? (
            <img
              src={buildUpload}
              className={classes.uploadIcon}
              style={{ opacity: iconsChecked.four ? '1' : '' }}
              alt="upload button"
            />
          ) : (
            <img
              src={CheckCircle}
              className={classes.checkCircle}
              alt="checkbox"
              style={{ opacity: '1' }}
            />
          )}
        </Paper>
        <Button
          className={classes.finishButton}
          onClick={() => {
            toast.success('Success! Your submission was submitted.');
            if (deal.metadata) history.push(`/deal-setup?id=${deal.metadata._id}`);
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
