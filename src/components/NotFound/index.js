import React from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import rocket from '../../assets/rocket.png';

export default function NotFound() {

  const history = useHistory();

  return (
    <div className="err-page">
      <img className="rocket-logo" src={rocket} alt="rocket-logo"/>
      <h1 className="err-header">
        Oh no! 404 error.
      </h1>
      <div className="err-text">
        The page was not found. Let's take your rocket back to safety.
      </div>
      <Button className="err-button" onClick={() => history.push(`/`)} variant="contained" color="primary">
        Go to homepage
      </Button>
    </div>
  );
}

