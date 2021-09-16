import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// eslint-disable-next-line import/no-useless-path-segments
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import buildDoc from '../../../../../assets/buildDoc.svg';
// eslint-disable-next-line import/no-useless-path-segments
import buildUpload from '../../../../../assets/buildUpload.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      // margin: theme.spacing(1),
      width: '267px',
      height: '166px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#7070703B',
    },
  },
  uploadContainer: {
    marginBottom: '16px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    borderRadius: '15px',
    width: '100%',
    padding: '42px',
  },
  title: { fontSize: '34px' },
  subtitle: {
    textAlign: 'left',
    font: 'normal normal normal 16px/19px Roboto',
    letterSpacing: '0px',
    color: '#186EFF',
    opacity: '1',
    marginBottom: '41px',
  },
  item: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #2A2B5480',
    borderRadius: '10px',
    opacity: 1,
    width: '100%',
    height: '91px',
    marginBottom: '8px',
  },
  itemText: {
    font: 'normal normal normal 18px/21px Roboto',
    color: '#2A2B54',
    letterSpacing: '0px',
    marginLeft: '17px',
    opacity: '1',
  },
  documentIcon: { marginLeft: '20px' },
  uploadIcon: {
    opacity: '0.3',
    width: '30px',
    marginLeft: 'auto',
    marginRight: '37px',
    color: 'blue',
  },
  finishButton: {
    font: 'normal normal bold 24px/28px Roboto',
    marginTop: '44px',
    width: '368px',
    height: '68px',
    background: '#39C522 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    opacity: '0.5',
    color: '#FFFFFF',
    textTransform: 'none',
    outline: 'none',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#3c52b2',
    },
  },
}));

export default function UploadDocs({ page, setPage }) {
  const classes = useStyles();
  const [iconsChecked, setIconsChecked] = useState({});
  const history = useHistory();
  console.log('state', iconsChecked);
  return (
    <>
      <Paper className={classes.uploadContainer}>
        <Typography variant="h6" gutterBottom className={classes.title}>
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
          <img
            src={buildDoc}
            alt="document icon"
            className={classes.documentIcon}
            style={{ opacity: iconsChecked.four ? '1' : '' }}
          />
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
          style={{
            font: 'normal normal normal 24px/28px Roboto',
            marginTop: '11px',
            marginLeft: '135px',
            padding: '5px',
            cursor: 'pointer',
          }}
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
