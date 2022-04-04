import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import styles from './styles';
import rocket from '../../assets/rocket.png';

export default function NotFound() {
  const history = useHistory();
  const classes = styles();

  return (
    <div className={classes.errPage}>
      <img className={classes.rocketLogo} src={rocket} alt="rocket-logo" />
      <h1 className={classes.errHeader}>Oh no! 404 error.</h1>
      <div className={classes.errText}>
        The page was not found. Let's take your rocket back to safety.
      </div>
      <Button
        className={classes.errButton}
        onClick={() => history.push(`/`)}
        variant="contained"
        color="primary"
      >
        Go to homepage
      </Button>
    </div>
  );
}
