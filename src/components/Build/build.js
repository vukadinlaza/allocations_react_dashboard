import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { Helmet } from 'react-helmet';
import {
  Button,
  TextField,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import countries from 'country-region-data';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';

import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

export default () => {
  return (
    <>
      <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', margin: '0' }}>
        {/* Left Column */}

        <Grid xs={12} sm={8} md={8} lg={8} style={{ border: '1rem solid transparent' }}>
          {/* Page 1 */}
          {/* Question 1 */}
          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Would you like to create an SPV or a Fund?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    SPV
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Fund
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Which type of asset are you investing in?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Startup
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Crypto
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Real Estate
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Gas / Oil
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    What is the name of the company?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid xs={12} sm={12} md={12} lg={12} style={{ marginBottom: '1rem', display: 'flex' }}>
                <TextField
                  required
                  style={{ width: '100%' }}
                  value=""
                  label="Subscriber First Name"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    How soon do you need to close the SPV?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    1 Week
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    2 Weeks
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    3 Weeks
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    4 Weeks
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    What is the expected wiring date to the company?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid xs={12} sm={12} md={12} lg={12} style={{ marginBottom: '1rem', display: 'flex' }}>
                <TextField
                  required
                  style={{ width: '100%' }}
                  value=""
                  label="Subscriber First Name"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Is this a one off SPV or do you plan to do multiple SPVs?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    One-Off
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Multiple
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          {/* Page 2 */}
          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Will the Organizer charge any management fees?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Yes
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    No
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Will the Organizer receive any carried interest from profits?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Yes
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    No
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Will the Organizer receive any carried interest from profits?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Direct
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Secondary
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    SPV in SPV
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Please enter a name for your SPV Series
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid xs={12} sm={12} md={12} lg={12} style={{ marginBottom: '1rem', display: 'flex' }}>
                <TextField
                  required
                  style={{ width: '100%' }}
                  value=""
                  label="Subscriber First Name"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    What is the name of the Organizer of the SPV?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid xs={12} sm={12} md={12} lg={12} style={{ marginBottom: '1rem', display: 'flex' }}>
                <TextField
                  required
                  style={{ width: '100%' }}
                  value=""
                  label="Subscriber First Name"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Do you already have the investment agreement for the Portfolio Company?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Yes
                  </div>
                </Grid>
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'transparent',
                      borderRadius: '4px',
                      color: 'black',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    No
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          {/* Page 3 */}

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Do you have a deck or other marketing material from the Portfolio Company?
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Upload File(s)
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: '1rem', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                    Please attach deck or marketing material{' '}
                  </Typography>
                  <InfoIcon />
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: '1rem', display: 'flex', padding: '0.5rem' }}
              >
                <Grid xs={4} sm={4} md={4} lg={4}>
                  <div
                    style={{
                      background: 'blue',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Upload File(s)
                  </div>
                </Grid>
                {/* Spacing */}
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
                <Grid xs={4} sm={4} md={4} lg={4} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid xs={12} sm={4} md={4} lg={4} style={{ border: '1rem solid transparent' }}>
          <Paper style={{ marginBottom: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
            <Grid xs={12} sm={12} md={12} lg={12} style={{}}>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h5">
                Services Agreement
              </Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Type: SPV</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Asset type: Startup</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Portfolio Company: SpaceX</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Closing time: 1 week</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Exp. wiring date: 12/21/2020</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}># of SPVs: One off</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Management fees: No</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Carried interest: No</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>SPV type: Direct</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Series name: Browder Capital</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Organizer: Joshua Browder</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Investment agreement: No</Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ background: 'blue', paddingTop: '1em', paddingBottom: '1em', color: 'white', margin: '0' }}
            >
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Subtotal: $0</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Bluesky Fees: $0</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Grand Total: $0</Typography>
              <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }}>Estimated Delivery: 3 Weeks</Typography>
            </Grid>
          </Paper>
        </Grid>

        {/* end grid */}
      </Grid>
    </>
  );
};
