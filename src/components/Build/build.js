import React, { useState } from 'react';
import { Button, TextField, Paper, Grid, Typography, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

import './style.scss';

const useStyles = makeStyles((theme) => ({
  button: {
    border: 'solid 2px #2676FF',
    minWidth: '90%',
    width: '90%',
    color: '#2676FF',
  },
  sidebar: {
    postion: 'sticky',
    top: '30vh !important',
  },
}));
const CREATE_ORG_AND_DEAL = gql`
  mutation CreateOrgAndDeal($orgName: String!, $deal: DealInput!) {
    createOrgAndDeal(orgName: $orgName, deal: $deal) {
      _id
      organization {
        _id
        slug
      }
    }
  }
`;
const BASE = 'appdPrRjapx8iYnIn';
const TABEL_NAME = 'Deals';
export default ({ deal, user, data, setData, setStep }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const [createOrgAndDeal, {}] = useMutation(CREATE_ORG_AND_DEAL, {});

  const submitData = async () => {
    if (!data.airtableId) {
      const response = await fetch(`https://api.airtable.com/v0/${BASE}/${TABEL_NAME}`, {
        method: 'post', // make sure it is a "POST request"
        body: JSON.stringify({ fields: data }),
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
          'Content-Type': 'application/json', // we will recive a json object
        },
      });
      const res = await response.json();
      console.log(res);
      createOrgAndDeal({
        variables: {
          orgName: `${user.email}'s Fund - ${
            res.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          }`,
          deal: { airtableId: res.id, status: 'draft' },
        },
      });

      return setData({ airtableId: res.id });
    }

    const payload = {
      records: [
        {
          id: data.airtableId,
          fields: data,
        },
      ],
    };

    await fetch(`https://api.airtable.com/v0/${BASE}/${TABEL_NAME}`, {
      method: 'patch', // make sure it is a "PATCH request"
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
        'Content-Type': 'application/json', // we will recive a json object
      },
    });
  };

  return (
    <>
      <Grid container spacing={2} style={{ maxWidth: '50%', marginTop: '-4rem' }}>
        {['Basic', 'Intermediate', 'Materials', 'Advanced'].map((t) => (
          <Grid item xs={3} sm={3} md={3} lg={3}>
            <Typography variant="h6" style={{ color: 'white', borderBottom: '5px solid white' }}>
              {t}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', margin: '0' }}>
        {/* Left Column */}
        <Grid xs={12} sm={8} md={8} lg={8} style={{ border: '1rem solid transparent' }}>
          {/* Page 1 */}
          {/* Question 1 */}
          {page === 1 && (
            <>
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
                        Would you like to create an SPV or a Fund?
                      </Typography>
                      <InfoIcon stye={{ background: 'rgba(0,0,0,0.4)' }} />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['SPV', 'FUND'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.deal_type === t ? '#2676FF' : 'white',
                            color: data.deal_type === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ deal_type: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                    {/* Spacing */}
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                  </Grid>
                </Grid>
              </Paper>

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
                        Which type of asset are you investing in?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['Startup', 'Crypto', 'Real Estate', 'Oil/Gas'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.asset_type === t ? '#2676FF' : 'white',
                            color: data.asset_type === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ asset_type: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Paper>

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
                        What is the name of the company?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                    <TextField
                      required
                      style={{ width: '100%' }}
                      variant="outlined"
                      label="Company Name"
                      value={data.company_name || ''}
                      onChange={(e) => setData({ company_name: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Paper>

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
                        How soon do you need to close the SPV?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.closing_time === t ? '#2676FF' : 'white',
                            color: data.closing_time === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ closing_time: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Paper>

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
                        What is the expected wiring date to the company?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                    <TextField
                      required
                      style={{ width: '100%' }}
                      onChange={(e) => setData({ wiring_date: e.target.value })}
                      label="Wiring Date"
                      type="date"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>

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
                        Is this a one off SPV or do you plan to do multiple SPVs?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['One Off', 'Multiple'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.num_spvs === t ? '#2676FF' : 'white',
                            color: data.num_spvs === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ num_spvs: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                    {/* Spacing */}
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
          {/* Page 2 */}
          {page === 2 && (
            <>
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
                        Will the Organizer charge any management fees?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['Yes', 'No'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.org_charge_mgmt_fee === t ? '#2676FF' : 'white',
                            color: data.org_charge_mgmt_fee === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ org_charge_mgmt_fee: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                    {/* Spacing */}
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                  </Grid>
                </Grid>
              </Paper>
              {data.org_charge_mgmt_fee === 'Yes' && (
                <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
                  <Grid xs={12} sm={12} md={12} lg={12}>
                    <Grid xs={12} sm={12} md={12} lg={12}>
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '0.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                          How much will the Organizer charge as management fees?
                        </Typography>
                        <InfoIcon />
                      </Grid>
                    </Grid>
                    <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                      <TextField
                        required
                        style={{ width: '100%' }}
                        type="number"
                        variant="outlined"
                        label="Fee Amount"
                        value={data.org_charge_mgmt_fee_amount || ''}
                        onChange={(e) => setData({ org_charge_mgmt_fee_amount: e.target.value })}
                      />
                      {/* Spacing */}
                    </Grid>
                  </Grid>
                </Paper>
              )}
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
                        Will the Organizer receive any carried interest from profits?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['Yes', 'No'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.org_recieve_carry === t ? '#2676FF' : 'white',
                            color: data.org_recieve_carry === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ org_recieve_carry: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                    {/* Spacing */}
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                  </Grid>
                </Grid>
              </Paper>
              {data.org_recieve_carry === 'Yes' && (
                <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
                  <Grid xs={12} sm={12} md={12} lg={12}>
                    <Grid xs={12} sm={12} md={12} lg={12}>
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          padding: '0.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
                          Will the Organizer receive any carried interest from profits?
                        </Typography>
                        <InfoIcon />
                      </Grid>
                    </Grid>
                    <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                      <TextField
                        required
                        style={{ width: '100%' }}
                        type="number"
                        variant="outlined"
                        label="Fee Amount"
                        value={data.org_recieve_carry_amount || ''}
                        onChange={(e) => setData({ org_recieve_carry_amount: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}
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
                        Please enter a name for your SPV Series
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                    <TextField
                      required
                      style={{ width: '100%' }}
                      label="SPV Series Name"
                      variant="outlined"
                      value={data.master_series_name || ''}
                      onChange={(e) => setData({ master_series_name: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Paper>
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
                        What is the name of the Organizer of the SPV?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
                    <TextField
                      required
                      style={{ width: '100%' }}
                      label="Organizer Name"
                      variant="outlined"
                      value={data.organizer_name || ''}
                      onChange={(e) => setData({ organizer_name: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Paper>
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
                        Do you already have the investment agreement for the Portfolio Company?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    {['Yes', 'No'].map((t) => (
                      <Grid xs={4} sm={4} md={4} lg={4}>
                        <Button
                          variant="outline"
                          color="#2676FF"
                          className={classes.button}
                          style={{
                            background: data.has_investment_agreement === t ? '#2676FF' : 'white',
                            color: data.has_investment_agreement === t ? 'white' : '#2676FF',
                          }}
                          onClick={() => setData({ has_investment_agreement: t })}
                        >
                          {t}
                        </Button>
                      </Grid>
                    ))}
                    {/* Spacing */}
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
          {/* Page 3 */}

          {page === 3 && (
            <>
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
                        Do you have a deck or other marketing material from the Portfolio Company?
                      </Typography>
                      <InfoIcon />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
                    <Grid xs={4} sm={4} md={4} lg={4}>
                      <Input
                        type="file"
                        onChange={({ target }) => {
                          if (target.validity.valid) setData({ passport: target.files[0] });
                        }}
                      />
                      Upload File(s)
                    </Grid>
                    {/* Spacing */}
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                    <Grid xs={4} sm={4} md={4} lg={4} />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </Grid>

        {/* Right Column */}
        <Grid xs={12} sm={4} md={4} lg={4} style={{ border: '1rem solid transparent' }}>
          <div className={classes.sidebar}>
            <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem' }}>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ padding: '0.75rem', height: '350px', maxHeight: '350px', overflow: 'scroll' }}
              >
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h5">
                    Services Agreement
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Type
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.deal_type}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Asset type:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.asset_type}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Portfolio Company:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.company_name}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Closing time:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.closing_time}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Exp. wiring date:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.wiring_date}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    # of SPVs:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.num_spvs}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Management fees:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.org_charge_mgmt_fee}
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Management fee amount:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.org_charge_mgmt_fee_amount}
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Carried interest:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.org_recieve_carry}
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    SPV type:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    What Do?
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Series name:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.master_series_name}
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Organizer:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.organizer_name}
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    Investment agreement:
                  </Typography>
                  <Typography xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    {data.has_investment_agreement}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  background: '#2676FF',
                  paddingTop: '1em',
                  paddingBottom: '1em',
                  color: 'white',
                  padding: '.75rem',
                }}
              >
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    Subtotal:
                  </Typography>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    $0
                  </Typography>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    Blussky Fees:
                  </Typography>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    $0
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    Grand Total:
                  </Typography>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    $0
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    Estimated Delivery:
                  </Typography>
                  <Typography
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginTop: '0.5rem' }}
                    variant="h5"
                  >
                    3 Weeks
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {page > 1 && (
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <Button
                    onClick={() => setPage(page - 1)}
                    variant="contained"
                    style={{ backgroundColor: '#2676FF', color: 'white', width: '100%', textTransform: 'capitalize' }}
                  >
                    Previous
                  </Button>
                </Grid>
              )}
              <Grid item xs={6} sm={6} md={6} lg={6}>
                {page < 3 ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ width: '100%' }}
                    onClick={() => {
                      submitData();
                      setPage(page + 1);
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setStep('sign')}
                    color="secondary"
                    style={{ width: '100%' }}
                  >
                    Finish
                  </Button>
                )}
              </Grid>
            </Grid>
          </div>
        </Grid>
        {/* end grid */}
      </Grid>
    </>
  );
};
