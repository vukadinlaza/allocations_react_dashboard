import React from 'react';
import { groupBy, map } from 'lodash';
import { Button, TextField, Paper, Grid, Typography, Slider } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/core/styles';
import { useFetch } from '../../utils/hooks';

const BASE = 'appD85EnbTN8tKWB9';
const TABLE = 'SPVs';
export default ({ setData, classes, answers, activePage }) => {
  const { data } = useFetch(BASE, TABLE);
  console.log('ANSERS', answers);
  const PrettoSlider = withStyles({
    root: {
      color: '#52af77',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);
  const atQuestions = (data || []).map((r) => ({ id: r.id, ...r.fields }));
  const questionsByPage = groupBy(atQuestions, 'Page');
  const questions = map(questionsByPage, (page) => {
    return page.map((question) => {
      let x = null;
      switch (question.Type) {
        case 'Multiple choice':
          x = activePage === question.Page && (
            <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                      {question.Question}
                    </Typography>
                    <InfoIcon stye={{ background: 'rgba(0,0,0,0.4)' }} />
                  </Grid>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                  {question.Options.map((t) => (
                    <Grid xs={4} sm={4} md={4} lg={4}>
                      <Button
                        variant="outline"
                        color="#2676FF"
                        className={classes.button}
                        style={{
                          background: answers[question.slug] === t ? '#2676FF' : 'white',
                          color: answers[question.slug] === t ? 'white' : '#2676FF',
                        }}
                        onClick={() => setData({ [question.slug]: t })}
                      >
                        {t}
                      </Button>
                    </Grid>
                  ))}
                  {/* Spacing */}
                  {/* <Grid xs={4} sm={4} md={4} lg={4} />
                  <Grid xs={4} sm={4} md={4} lg={4} /> */}
                </Grid>
              </Grid>
            </Paper>
          );
          break;
        case 'Text':
          x = activePage === question.Page && (
            <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                      {question.Question}
                    </Typography>
                    <InfoIcon />
                  </Grid>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={question.Question}
                    value={answers[question.slug] || ''}
                    onChange={(e) => setData({ [question.slug]: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Paper>
          );
          break;
        case 'Date':
          x = activePage === question.Page && (
            <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                      {question.Question}
                    </Typography>
                    <InfoIcon />
                  </Grid>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    onChange={(e) => setData({ [question.slug]: e.target.value })}
                    label={question.Question}
                    type="date"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
          );
          break;
        case 'Slider':
          x = activePage === question.Page && (
            <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                      {question.Question}
                    </Typography>
                    <InfoIcon />
                  </Grid>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <PrettoSlider
                    defaultValue={0}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={question.Step}
                    marks
                    min={question.Minimum}
                    max={question.Maximum}
                  />
                </Grid>
              </Grid>
            </Paper>
          );
          break;
        default:
        // code block
      }
      return x;
    });
  });
  return <div>{questions}</div>;
};
