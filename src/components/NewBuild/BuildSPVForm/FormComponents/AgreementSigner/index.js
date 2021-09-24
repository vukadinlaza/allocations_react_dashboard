import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import buildDoc from '../../../../../assets/buildDoc.svg';
import useStyles from '../../../BuildStyles';

export default function SignDocsForm({ page, setPage }) {
  const classes = useStyles();
  const [iconsChecked, setIconsChecked] = useState({});
  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          Sign your agreements
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please sign the appropriate agreements to consent to us to start creating your deals on
          your behalf
        </Typography>
        <Paper
          className={classes.item}
          onClick={() =>
            setIconsChecked((prev) => {
              return { ...prev, one: true };
            })
          }
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
