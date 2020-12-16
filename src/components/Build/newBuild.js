import React from 'react';
import { Paper, Grid, Typography, TextField, Slider, Button, Tooltip } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { nWithCommas } from '../../utils/numbers';

const useStyles = makeStyles((theme) => ({
  questionHeader: {
    color: '#3A506B',
    marginTop: '1.75rem',
    marginBottom: '.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
  answerText: {
    color: '#3A506B',
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    textAlign: 'center',
    fontSize: '1rem',
  },
  warning: {
    color: '#FF0000',
  },
  warningTxt: {},
}));
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#273560',
    color: 'white',
    maxWidth: '400px',
    fontSize: '1rem',
    padding: '.5rem',
  },
}))(Tooltip);
export default ({ setData, data, activeStep, handleNext, handleBack }) => {
  const classes = useStyles();
  return (
    <>
      {activeStep === 1 && (
        <>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose your fund type</>
              <CheckCircleIcon style={{ color: data['Choose your fund type'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid container spacing={1}>
              {[
                { type: 'SPV', price: 8000 },
                { type: 'Fund', price: 26000 },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Choose your fund type': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: data['Choose your fund type'] === item.type ? '2px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography className={classes.answerText}>{item.type}</Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose your asset type</>
              <CheckCircleIcon style={{ color: data['Choose your asset type'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid container spacing={1}>
              {[
                {
                  type: 'Startup',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/rocket.svg',
                },
                {
                  type: 'Crypto',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
                },
                {
                  type: 'Real estate',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/house.svg',
                },
                {
                  type: 'Custom',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/settings.svg',
                },
              ].map((item) => {
                return (
                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Choose your asset type': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: data['Choose your asset type'] === item.type ? '2px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography className={classes.answerText}>{item.type}</Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Enter name of portfolio company</>
              <CheckCircleIcon style={{ color: data['Enter name of portfolio company'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    variant="outlined"
                    label="Company Name"
                    value={data['Enter name of portfolio company'] || ''}
                    onChange={(e) => setData({ 'Enter name of portfolio company': e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose the name of your private fund</>
              <CheckCircleIcon
                style={{ color: data['Choose the name of your private fund'] ? '#26C604' : '#00000029' }}
              />
            </Typography>
            <Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    variant="outlined"
                    label="Fund Name"
                    value={data['Choose the name of your private fund'] || ''}
                    onChange={(e) => setData({ 'Choose the name of your private fund': e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose the name of your manager</>
              <CheckCircleIcon style={{ color: data['Choose the name of your manager'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    variant="outlined"
                    label="Organizer Name"
                    value={data['Choose the name of your manager'] || ''}
                    onChange={(e) => setData({ 'Choose the name of your manager': e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
        </>
      )}
      {activeStep === 2 && (
        <>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose your speed</>
              <CheckCircleIcon style={{ color: data['Choose your speed'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid container spacing={1}>
              {[
                { type: 'Standard', price: 8000 },
                {
                  type: 'Express',
                  price: 26000,
                  warning:
                    'If you select express, the SPV will be formed under Sharding Holdings Management LLC with a bank account already set up. We also require the portfolio company investment agreement in draft or final form.',
                },
                { type: 'No rush delivery', price: 26000 },
              ].map((item) => {
                return (
                  <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Choose your speed': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: data['Choose your speed'] === item.type ? '2px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        {item.warning ? (
                          <HtmlTooltip
                            title={
                              <>
                                <span className={classes.warning}>Warning: </span>
                                <span className={classes.warningTxt}>{item.warning}</span>
                              </>
                            }
                          >
                            <Typography className={classes.answerText}>{item.type}</Typography>
                          </HtmlTooltip>
                        ) : (
                          <Typography className={classes.answerText}>{item.type}</Typography>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose your wiring date</>
              <CheckCircleIcon style={{ color: data['Choose your wiring date'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <TextField
                    defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                    value={moment(new Date(data['Choose your wiring date'])).format('YYYY-MM-DD')}
                    style={{ width: '100%' }}
                    onChange={(e) => setData({ 'Choose your wiring date': e.target.value })}
                    label="Choose your wiring date"
                    type="date"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
        </>
      )}
      {activeStep === 3 && (
        <>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <span>
                <>Choose your management fee:</>
                <span style={{ marginLeft: '1rem' }} />
                {nWithCommas(data['Choose your management fee'] || 0)} %
              </span>
              <CheckCircleIcon style={{ color: data['Choose your management fee'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid>
              <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '1.5rem' }}
              >
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <Slider
                    defaultValue={0}
                    // aria-labelledby="discrete-slider"
                    // valueLabelDisplay="auto"
                    step={0.1}
                    value={data['Choose your management fee'] || 0}
                    // marks={question?.Steps ? question.Steps.map((s) => ({ value: s })) : true}
                    min={0}
                    max={3}
                    onChange={(e, v) => setData({ 'Choose your management fee': v.toString() })}
                  />
                </Grid>
              </Paper>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <span>
                <>Choose your carry:</>
                <span style={{ marginLeft: '1rem' }} />
                {nWithCommas(data['Choose your carry'] || 0)} %
              </span>
              <CheckCircleIcon style={{ color: data['Choose your carry'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid>
              <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '1.5rem' }}
              >
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                  <Slider
                    defaultValue={0}
                    // aria-labelledby="discrete-slider"
                    // valueLabelDisplay="auto"
                    step={0.1}
                    value={data['Choose your carry'] || 0}
                    // marks={question?.Steps ? question.Steps.map((s) => ({ value: s })) : true}
                    min={0}
                    max={30}
                    onChange={(e, v) => setData({ 'Choose your carry': v.toString() })}
                  />
                </Grid>
              </Paper>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Will you charge same fees for all investors?</>
              <CheckCircleIcon
                style={{ color: data['Will you charge same fees for all investors?'] ? '#26C604' : '#00000029' }}
              />
            </Typography>
            <Grid container spacing={1}>
              {[
                { type: 'Yes', price: 8000 },
                { type: 'No', price: 26000 },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Will you charge same fees for all investors?': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border:
                            data['Will you charge same fees for all investors?'] === item.type
                              ? '2px solid #2576FF'
                              : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography className={classes.answerText}>{item.type}</Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>{' '}
        </>
      )}
      {activeStep === 4 && (
        <>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <span>
                <>Enter your minimum investment amount:</>
                {/* <span style={{ marginLeft: '1rem' }} />${nWithCommas(data['Enter your minimum investment amount'] || 0)} */}
              </span>
              <CheckCircleIcon
                style={{ color: data['Enter your minimum investment amount'] ? '#26C604' : '#00000029' }}
              />
            </Typography>
            <Grid>
              <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                {/* <Slider
                    defaultValue={0}
                    // aria-labelledby="discrete-slider"
                    // valueLabelDisplay="auto"
                    step={5000}
                    value={data['Enter your minimum investment amount'] || 0}
                    // marks={question?.Steps ? question.Steps.map((s) => ({ value: s })) : true}
                    min={0}
                    max={100000}
                    onChange={(e, v) => setData({ 'Enter your minimum investment amount': v.toString() })}
                  /> */}
                <TextField
                  required
                  style={{ width: '100%' }}
                  variant="outlined"
                  label="Minimum investment"
                  value={data['Enter your minimum investment amount'] || ''}
                  onChange={(e) => setData({ 'Enter your minimum investment amount': e.target.value })}
                />
              </Grid>
              {/* </Paper> */}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Would you like to hire Allocations as the exempt reporting advisor?</>
              <CheckCircleIcon
                style={{
                  color: data['Would you like to hire Allocations as the exempt reporting advisor?']
                    ? '#26C604'
                    : '#00000029',
                }}
              />
            </Typography>
            <Grid container spacing={1} justify="space-around">
              {[
                {
                  type: 'Yes',
                },
                {
                  type: 'No',
                  warning:
                    'Failure to comply with SEC / FINRA exempt reporting adviser requirements can result in fines and penalties.',
                },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Would you like to hire Allocations as the exempt reporting advisor?': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border:
                            data['Would you like to hire Allocations as the exempt reporting advisor?'] === item.type
                              ? '2px solid #2576FF'
                              : '',
                        }}
                      >
                        {item.warning ? (
                          <HtmlTooltip
                            title={
                              <>
                                <span className={classes.warning}>Warning: </span>
                                <span className={classes.warningTxt}>{item.warning}</span>
                              </>
                            }
                          >
                            <Typography className={classes.answerText}>{item.type}</Typography>
                          </HtmlTooltip>
                        ) : (
                          <Typography className={classes.answerText}>{item.type}</Typography>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Choose offering type</>
              <CheckCircleIcon style={{ color: data['Choose offering type'] ? '#26C604' : '#00000029' }} />
            </Typography>
            <Grid container spacing={1} justify="space-around">
              {[
                {
                  type: '506b',
                  warning:
                    'You may not generally solicit or advertise to investors for which you don’t have a pre-existing relationship',
                },
                {
                  type: '506c',
                  warning: 'Your investors will be required to complete accredited investor verification',
                },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Choose offering type': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: data['Choose offering type'] === item.type ? '2px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        {item.warning ? (
                          <HtmlTooltip
                            title={
                              <>
                                <span className={classes.warning}>Warning: </span>
                                <span className={classes.warningTxt}>{item.warning}</span>
                              </>
                            }
                          >
                            <Typography className={classes.answerText}>{item.type}</Typography>
                          </HtmlTooltip>
                        ) : (
                          <Typography className={classes.answerText}>{item.type}</Typography>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Has your attorney already provided SPV docs?</>
              <CheckCircleIcon
                style={{ color: data['Has your attorney already provided SPV docs?'] ? '#26C604' : '#00000029' }}
              />
            </Typography>
            <Grid container spacing={1} justify="space-around">
              {[
                {
                  type: 'Yes',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/rocket.svg',
                },
                {
                  type: 'No',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
                },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Has your attorney already provided SPV docs?': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border:
                            data['Has your attorney already provided SPV docs?'] === item.type
                              ? '2px solid #2576FF'
                              : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography className={classes.answerText}>{item.type}</Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography className={classes.questionHeader}>
              <>Will you invite any investors from New York?</>
              <CheckCircleIcon
                style={{ color: data['Will you invite any investors from New York?'] ? '#26C604' : '#00000029' }}
              />
            </Typography>
            <Grid container spacing={1} justify="space-around">
              {[
                {
                  type: 'Yes',
                  warning:
                    'Warning: If you include New York investors, there will be additional Blue sky filings and fees associated for their access.',
                },
                {
                  type: 'No',
                  warning:
                    'If you do include New York investors at a later time, there will be additional Blue sky fees and filings associated.',
                },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                        minWidth: '100%',
                      }}
                      onClick={() => {
                        setData({ 'Will you invite any investors from New York?': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border:
                            data['Will you invite any investors from New York?'] === item.type
                              ? '2px solid #2576FF'
                              : '',
                        }}
                      >
                        {item.warning ? (
                          <HtmlTooltip
                            title={
                              <>
                                <span className={classes.warning}>Warning: </span>
                                <span className={classes.warningTxt}>{item.warning}</span>
                              </>
                            }
                          >
                            <Typography className={classes.answerText}>{item.type}</Typography>
                          </HtmlTooltip>
                        ) : (
                          <Typography className={classes.answerText}>{item.type}</Typography>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </>
      )}

      <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <>
          {activeStep > 1 && (
            <Button
              variant="contained"
              onClick={handleBack}
              style={{
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#273560',
                borderRadius: '2rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                border: 'solid 2px #273560',
                margin: '1rem',
                height: '35px',
              }}
            >
              Previous{' '}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            style={{
              fontSize: '1rem',
              color: 'white',
              backgroundColor: '#273560',
              marginTop: '1rem',
              borderRadius: '2rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              height: '35px',
            }}
          >
            {activeStep >= 4 ? 'Submit' : 'Next'}
          </Button>
        </>
      </Grid>
    </>
  );
};
