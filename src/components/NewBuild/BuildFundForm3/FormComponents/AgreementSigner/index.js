import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import buildDoc from '../../../../../assets/buildDoc.svg';

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
    height: '544px',
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
  checkCircle: {
    opacity: '0.3',
    transparentheight: '35px',
    width: '38px',
    marginLeft: 'auto',
    marginRight: '37px',
  },

  uploadIcon: {
    opacity: '0.3',
    width: '30px',
    marginLeft: 'auto',
    marginRight: '37px',
  },
  continueButton: {
    font: 'normal normal bold 24px/28px Roboto',
    marginTop: '44px',
    width: '368px',
    height: '68px',
    background: '#186EFF 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    opacity: '0.5',
    color: '#FFFFFF',
    textTransform: 'none',
    outline: 'none',
  },
}));

export default function SignDocsForm({ page, setPage }) {
  const classes = useStyles();
  const [iconsChecked, setIconsChecked] = useState({ one: true, two: true });
  return (
    <>
      <Paper className={classes.uploadContainer}>
        <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
          Sign your agreements
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please sign the appropriate agreements to consent to us to start creating your deals on
          your behalf
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
          <Typography className={classes.itemText}>Service Agreement</Typography>
          <img
            src={CheckCircle}
            className={classes.checkCircle}
            alt="checkbox"
            style={{ opacity: iconsChecked.one ? '1' : '' }}
          />
        </Paper>
        <Paper
          className={classes.item}
          onClick={() =>
            setIconsChecked((prev) => {
              return { ...prev, two: true };
            })
          }
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Memorandum of Understanding</Typography>
          <img
            src={CheckCircle}
            className={classes.checkCircle}
            alt="checkbox"
            style={{ opacity: iconsChecked.two ? '1' : '' }}
          />
        </Paper>
        <Button
          onClick={() => {
            setPage(page + 1);
          }}
          className={classes.continueButton}
        >
          Continue
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
