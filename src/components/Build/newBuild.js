import React from 'react';
import { Paper, Grid, Typography, TextField, Slider, Button } from '@material-ui/core';
import {} from '@material-ui/core/styles';
import { get } from 'lodash';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';
import { nWithCommas } from '../../utils/numbers';

export default ({ setData, data, activeStep, handleNext, handleBack }) => {
  return (
    <>
      {activeStep === 0 && (
        <>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose your fund type</>
              <InfoIcon />
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
                          border: data['Choose your asset type'] === item.type ? '4px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography
                          variant="h6"
                          style={{
                            color: 'black',
                            paddingTop: '.5rem',
                            paddingBottom: '.5rem',
                            minWidth: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {item.type}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{
                color: 'black',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              <>Choose your asset type</>
              <InfoIcon />
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
                          border: data['Choose your asset type'] === item.type ? '4px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography
                          variant="h6"
                          style={{
                            color: 'black',
                            paddingTop: '.5rem',
                            paddingBottom: '.5rem',
                            minWidth: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {item.type}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Enter name of portfolio company</>
              <InfoIcon />
            </Typography>
            <Grid>
              <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}
              >
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
              </Paper>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose the name of your private fund</>
              <InfoIcon />
            </Typography>
            <Grid>
              <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}
              >
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
              </Paper>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose the name of your manager</>
              <InfoIcon />
            </Typography>
            <Grid>
              <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                    <TextField
                      required
                      style={{ width: '100%' }}
                      variant="outlined"
                      label="Organizer Name"
                      value={data['Choose the name of your organizer'] || ''}
                      onChange={(e) => setData({ 'Choose the name of your organizer': e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
        </>
      )}
      {activeStep === 1 && (
        <>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose your speed</>
              <InfoIcon />
            </Typography>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '1rem',
              }}
            >
              {[
                { type: 'Standard', subtext: 'Wire in 14 business days', price: 0 },
                {
                  type: 'Express',
                  subtext: 'Wire in 7 business days',
                  price: 0,
                  warningTitle: 'Warning',
                  warning:
                    'If you select express, the SPV will be formed under Sharding Holdings Management LLC with a bank account already set up. We also require the portfolio company investment agreement in draft or final form.',
                },
                { type: 'No Rush', subtext: 'Select Wire Date', price: 0 },
              ].map((item) => {
                return (
                  <>
                    <Paper
                      onClick={() => {
                        setData({ 'Choose your speed': item.type });
                      }}
                      style={{
                        width: '30%',
                        padding: '1rem',
                        border: data['Choose your speed'] === item.type ? '4px solid #2576FF' : '',
                      }}
                    >
                      <Typography>{item.type}</Typography>
                    </Paper>
                    <div style={{ minHeight: '1rem' }} />
                  </>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose your wiring date</>
              <InfoIcon />
            </Typography>
            <Grid>
              <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}
              >
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
              </Paper>
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
        </>
      )}
      {activeStep === 2 && (
        <>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose your management fee</>
              <span style={{ marginLeft: '1rem' }} />
              {nWithCommas(data['Choose your management fee'] || 0)} %
              <InfoIcon />
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
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose your carry</>
              <span style={{ marginLeft: '1rem' }} />
              {nWithCommas(data['Choose your carry'] || 0)} %
              <InfoIcon />
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
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Will you charge same fees for all investors?</>
              <InfoIcon />
            </Typography>
            <Grid>
              {[
                { type: 'Yes', subtext: '', price: 0 },
                { type: 'No', subtext: '', price: 2000 },
              ].map((item) => {
                return (
                  <>
                    <Paper
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
                          display: 'flex',
                          border:
                            data['Will you charge same fees for all investors?'] === item.type
                              ? '4px solid #2576FF'
                              : '',
                        }}
                      >
                        <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                          <Typography variant="h6" style={{ color: 'black' }}>
                            {item.type}
                          </Typography>
                          <Typography variant="subtitle2" style={{ color: 'grey' }}>
                            {item.subtext}
                          </Typography>
                        </Grid>
                        <Grid
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                        >
                          <Typography variant="h6" style={{ color: 'grey', marginRight: '2rem' }}>
                            + ${nWithCommas(item.price)}.00
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                    <div style={{ minHeight: '1rem' }} />
                  </>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>{' '}
        </>
      )}
      {activeStep === 3 && (
        <>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Enter your minimum investment amount</>
              <span style={{ marginLeft: '1rem' }} />${nWithCommas(data['Enter your minimum investment amount'] || 0)}
              <InfoIcon />
            </Typography>
            <Grid>
              {/* <Paper
                style={{
                  border: 'solid 1px #2576FF',
                }}
                style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '1.5rem' }}
              > */}
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
                  label="minimum Investment"
                  value={data['Enter your minimum investment amount'] || ''}
                  onChange={(e) => setData({ 'Enter your minimum investment amount': e.target.value })}
                />
              </Grid>
              {/* </Paper> */}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid
            justify="space-between"
            style={{
              margin: '.5rem',
            }}
          >
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Would you like to hire Allocations as the exempt reporting advisor?</>
              <InfoIcon />
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
                          border: data['Choose your asset type'] === item.type ? '4px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography
                          variant="h6"
                          style={{
                            color: 'black',
                            paddingTop: '.5rem',
                            paddingBottom: '.5rem',
                            minWidth: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {item.type}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          {/* <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>How much do you plan to raise?</>
              <span style={{ marginLeft: '1rem' }} />${nWithCommas(data['How much do you plan to raise?'] || 0)}
              <InfoIcon />
            </Typography>
            <Grid container spacing={1}>
              {[
                {
                  type: '100000',
                },
                {
                  type: '250000',
                },
                {
                  type: '500000',
                },
                {
                  type: '1000000',
                },
              ].map((item) => {
                return (
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Paper
                      style={{
                        border: 'solid 1px #2576FF',
                      }}
                      onClick={() => {
                        setData({ 'How much do you plan to raise?': item.type });
                      }}
                    >
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: data['How much do you plan to raise?'] === item.type ? '4px solid #2576FF' : '',
                        }}
                      >
                        <Typography
                          variant="h6"
                          style={{ color: 'black', paddingTop: '.5rem', paddingBottom: '.5rem' }}
                        >
                          About ${nWithCommas(Number(item.type))}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid> */}

          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Choose offering type</>
              <InfoIcon />
            </Typography>
            <Grid container spacing={1} justify="space-around">
              {[
                {
                  type: '506b',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/rocket.svg',
                },
                {
                  type: '506c',
                  url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
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
                          border: data['Choose your asset type'] === item.type ? '4px solid #2576FF' : '',
                        }}
                      >
                        {/* <img src={item.url} alt={item.type} style={{ width: '60px' }} /> */}
                        <Typography
                          variant="h6"
                          style={{
                            color: 'black',
                            paddingTop: '.5rem',
                            paddingBottom: '.5rem',
                            minWidth: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {item.type}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          <Grid justify="space-between">
            <Typography
              variant="h6"
              style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <>Has your attorney already provided SPV docs?</>
              <InfoIcon />
            </Typography>
            <Grid>
              {[
                { type: 'Yes', subtext: '', price: 0 },
                { type: 'No', subtext: '', price: 0 },
              ].map((item) => {
                return (
                  <>
                    <Paper
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
                          display: 'flex',
                          border:
                            data['Has your attorney already provided SPV docs?'] === item.type
                              ? '4px solid #2576FF'
                              : '',
                        }}
                      >
                        <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                          <Typography variant="h6" style={{ color: 'black' }}>
                            {item.type}
                          </Typography>
                          <Typography variant="subtitle2" style={{ color: 'grey' }}>
                            {item.subtext}
                          </Typography>
                        </Grid>
                        <Grid
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                        >
                          <Typography variant="h6" style={{ color: 'grey', marginRight: '2rem' }}>
                            + ${nWithCommas(item.price)}.00
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                    <div style={{ minHeight: '1rem' }} />
                  </>
                );
              })}
            </Grid>
            {/* <hr className="solid" /> */}
          </Grid>
          {(data['How much do you plan to raise?'] === '500000' ||
            data['How much do you plan to raise?'] === '1000000') && (
            <Grid justify="space-between">
              <Typography
                variant="h6"
                style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
              >
                <>Will you invite any investors from New York?</>
                <InfoIcon />
              </Typography>
              <Grid>
                {[
                  {
                    type: 'Yes',
                    subtext: '',
                    price: 1200,
                    warningTitle: 'Warning',
                    warning: 'If you include New York investors, there will be additional fee and filings associated.',
                  },
                  {
                    type: 'No',
                    subtext: '',
                    price: 0,
                    warningTitle: 'Warning',
                    warning:
                      'If you do include New York investors at a later time, there will be additional fee and filings associated.',
                  },
                ].map((item) => {
                  return (
                    <>
                      <Paper
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
                            display: 'flex',
                            border:
                              data['Will you invite any investors from New York?'] === item.type
                                ? '4px solid #2576FF'
                                : '',
                          }}
                        >
                          <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                            <Typography variant="h6" style={{ color: 'black' }}>
                              {item.type}
                            </Typography>
                            <Typography variant="subtitle2" style={{ color: 'grey' }}>
                              {item.subtext}
                            </Typography>
                            {data['Will you invite any investors from New York?'] === item.type && (
                              <Typography variant="subtitle2" style={{ color: 'grey', marginTop: '10px' }}>
                                <span style={{ color: 'red', fontWeight: '900', marginRight: '5px' }}>
                                  {item.warningTitle}
                                </span>
                                {item.warning}
                              </Typography>
                            )}
                          </Grid>
                          <Grid
                            xs={6}
                            sm={6}
                            md={6}
                            lg={6}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                          >
                            <Typography variant="h6" style={{ color: 'grey', marginRight: '2rem' }}>
                              + ${nWithCommas(item.price)}.00
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                      <div style={{ minHeight: '1rem' }} />
                    </>
                  );
                })}
              </Grid>
              {/* <hr className="solid" /> */}
            </Grid>
          )}
        </>
      )}

      <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
        {activeStep > 0 ? (
          <Button
            variant="contained"
            onClick={handleBack}
            style={{
              fontSize: '1rem',
              backgroundColor: 'white',
              color: '#273560',
              marginTop: '1rem',
              borderRadius: '2rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              border: 'solid 2px #273560',
            }}
          >
            Previous{' '}
          </Button>
        ) : (
          <div />
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
          }}
        >
          Next{' '}
        </Button>
      </Grid>
    </>
  );
};
