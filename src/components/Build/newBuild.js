import React from 'react';
import { Paper, Grid, Typography, TextField, Slider } from '@material-ui/core';
import {} from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';
import { nWithCommas } from '../../utils/numbers';

export default ({ setData, data }) => {
  return (
    <>
      <Grid justify="space-between">
        <Typography
          variant="h6"
          style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <>Choose your fund type</>
          <InfoIcon />
        </Typography>
        <Grid>
          {[
            { item: 'SPV', price: 8000 },
            { item: 'Fund', price: 26000 },
          ].map((item) => {
            return (
              <>
                <Paper
                  onClick={() => {
                    setData({ 'Choose your fund type': item.item });
                  }}
                >
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      display: 'flex',
                      border: data['Choose your fund type'] === item.item ? '4px solid #2576FF' : '',
                    }}
                  >
                    <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                      <Typography variant="h6" style={{ color: 'black' }}>
                        {item.item}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey' }}>
                        Up to 10 year lifespan
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
                        From ${nWithCommas(item.price)}.00
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                <div style={{ minHeight: '1rem' }} />
              </>
            );
          })}
        </Grid>
        <hr className="solid" />
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
              item: 'Startup',
              url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
            },
            {
              item: 'Crypto',
              url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
            },
            {
              item: 'Real estate',
              url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
            },
            {
              item: 'Custom',
              url: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/bitcoin.svg',
            },
          ].map((item) => {
            return (
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Paper
                  style={{
                    border: 'solid 1px #2576FF',
                  }}
                  onClick={() => {
                    setData({ 'Choose your asset type': item.item });
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
                      border: data['Choose your asset type'] === item.item ? '4px solid #2576FF' : '',
                    }}
                  >
                    <img src={item.url} alt={item.item} />
                    <Typography variant="h6" style={{ color: 'black', paddingTop: '.5rem', paddingBottom: '.5rem' }}>
                      {item.item}
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <hr className="solid" />
      </Grid>
      <Grid justify="space-between">
        <Typography
          variant="h6"
          style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <>Choose your speed</>
          <InfoIcon />
        </Typography>
        <Grid>
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
                >
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      display: 'flex',
                      border: data['Choose your speed'] === item.type ? '4px solid #2576FF' : '',
                    }}
                  >
                    <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                      <Typography variant="h6" style={{ color: 'black' }}>
                        {item.type}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey' }}>
                        {item.subtext}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey', marginTop: '10px' }}>
                        <span style={{ color: 'red', fontWeight: '900', marginRight: '5px' }}>{item.warningTitle}</span>
                        {item.warning}
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
        <hr className="solid" />
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
        <hr className="solid" />
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
        <hr className="solid" />
      </Grid>
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
                // step={question?.Steps ? null : question.Step}
                value={data['Choose your management fee'] || 0}
                // marks={question?.Steps ? question.Steps.map((s) => ({ value: s })) : true}
                min={0}
                max={3}
                onChange={(e, v) => setData({ 'Choose your management fee': v.toString() })}
              />
            </Grid>
          </Paper>
        </Grid>
        <hr className="solid" />
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
                // step={question?.Steps ? null : question.Step}
                value={data['Choose your carry'] || 0}
                // marks={question?.Steps ? question.Steps.map((s) => ({ value: s })) : true}
                min={0}
                max={30}
                onChange={(e, v) => setData({ 'Choose your carry': v.toString() })}
              />
            </Grid>
          </Paper>
        </Grid>
        <hr className="solid" />
      </Grid>
      <Grid justify="space-between">
        <Typography
          variant="h6"
          style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <>Choose the name of your organizer</>
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
        <hr className="solid" />
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
        <hr className="solid" />
      </Grid>
      <Grid justify="space-between">
        <Typography
          variant="h6"
          style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <>Would you like to hire Allocations as the exempt reporting advisor?</>
          <InfoIcon />
        </Typography>
        <Grid>
          {[
            {
              type: 'Yes',
              subtext: '',
              price: 2000,
              warningTitle: 'Warning',
              warning:
                'Allocations or one of its affiliates will act as the exempt reporting adviser on the SPV. You will be required to upload the investment agreement and materials at least 48 hours before investing.',
            },
            {
              type: 'No',
              subtext: '',
              price: 0,
              warningTitle: 'Warning',
              warning:
                'Failure to comply with SEC / FINRA exempt reporting adviser requirements can result in fines and penalties.',
            },
          ].map((item) => {
            return (
              <>
                <Paper
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
                      display: 'flex',
                      border:
                        data['Would you like to hire Allocations as the exempt reporting advisor?'] === item.type
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
                      <Typography variant="subtitle2" style={{ color: 'grey', marginTop: '10px' }}>
                        <span style={{ color: 'red', fontWeight: '900', marginRight: '5px' }}>{item.warningTitle}</span>
                        {item.warning}
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
        <hr className="solid" />
      </Grid>
      <Grid justify="space-between">
        <Typography
          variant="h6"
          style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <>Choose your minimum investment</>
          <span style={{ marginLeft: '1rem' }} />${nWithCommas(data['Choose your minimum investment'] || 0)}
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
                step={5000}
                value={data['Choose your minimum investment'] || 0}
                // marks={question?.Steps ? question.Steps.map((s) => ({ value: s })) : true}
                min={0}
                max={1000000}
                onChange={(e, v) => setData({ 'Choose your minimum investment': v.toString() })}
              />
            </Grid>
          </Paper>
        </Grid>
        <hr className="solid" />
      </Grid>
      <Grid justify="space-between">
        <Typography
          variant="h6"
          style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <>Choose offering type</>
          <InfoIcon />
        </Typography>
        <Grid>
          {[
            {
              type: '506b',
              subtext: '',
              price: 0,
              warningTitle: 'Warning',
              warning:
                'If you select express, the SPV will be formed under Sharding Holdings Management LLC with a bank account already set up. We also require the portfolio company investment agreement in draft or final form.',
            },
            {
              type: '506c (Advertising)',
              subtext: '+$69 per investor',
              price: 0,
              warningTitle: 'Warning',
              warning:
                'Your investors will be required to complete accredited investor verification (+$69 per investor)',
            },
          ].map((item) => {
            return (
              <>
                <Paper
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
                      display: 'flex',
                      border: data['Choose offering type'] === item.type ? '4px solid #2576FF' : '',
                    }}
                  >
                    <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                      <Typography variant="h6" style={{ color: 'black' }}>
                        {item.type}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey' }}>
                        {item.subtext}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey', marginTop: '10px' }}>
                        <span style={{ color: 'red', fontWeight: '900', marginRight: '5px' }}>{item.warningTitle}</span>
                        {item.warning}
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
        <hr className="solid" />
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
                        data['Has your attorney already provided SPV docs?'] === item.type ? '4px solid #2576FF' : '',
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
        <hr className="solid" />
      </Grid>
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
              warning:
                'If you do include New York investors at a later time, there will be additional fee and filings associated.',
            },
            {
              type: 'No',
              subtext: '',
              price: 0,
              warningTitle: 'Warning',
              warning: 'If you include New York investors, there will be additional fee and filings associated.',
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
                        data['Will you invite any investors from New York?'] === item.type ? '4px solid #2576FF' : '',
                    }}
                  >
                    <Grid xs={6} sm={6} md={6} lg={6} style={{ padding: '1.25rem' }}>
                      <Typography variant="h6" style={{ color: 'black' }}>
                        {item.type}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey' }}>
                        {item.subtext}
                      </Typography>
                      <Typography variant="subtitle2" style={{ color: 'grey', marginTop: '10px' }}>
                        <span style={{ color: 'red', fontWeight: '900', marginRight: '5px' }}>{item.warningTitle}</span>
                        {item.warning}
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
        <hr className="solid" />
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
                        data['Will you charge same fees for all investors?'] === item.type ? '4px solid #2576FF' : '',
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
        <hr className="solid" />
      </Grid>
    </>
  );
};
