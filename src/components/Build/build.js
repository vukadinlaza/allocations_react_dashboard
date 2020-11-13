/* eslint-disable max-len */
import React, { useState } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { groupBy, pick, map, get, toNumber } from 'lodash';
import { gql } from 'apollo-boost';

import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import Questions from './questions';
import './style.scss';

const images = {
  basic: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/graphic-bg.svg',
  1: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/blank-platform.svg',
  Startup1: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-1.svg',
  Startup2: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-2.svg',
  Startup3: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-custom.svg',
  Crypto1: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/crypto-step-2.svg',
  Crypto2: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/crypto-step-3.svg',
  Crypto3: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/crypto-step-custom.svg',
  RealEstate1: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/real-estate-step-1.svg',
  RealEstate2: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/real-estate-step-3.svg',
  RealEstate3: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/real-estate-step-custom.svg',
  Other1: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/custom-step-setup.svg',
  Other2: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/custom-step-details.svg',
  Other3: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/custom-step-custom.svg',
};
const zapierWebhook = 'https://hooks.zapier.com/hooks/catch/7904699/ol1c7go/';
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
const POST_ZAP = gql`
  mutation PostZap($body: Object) {
    postZap(data: $body) {
      _id
    }
  }
`;
const BASE = 'appdPrRjapx8iYnIn';
const TABEL_NAME = 'Deals';
export default ({ deal, user, data, setData, setStep, atQuestionsData }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [postZap, {}] = useMutation(POST_ZAP);
  const fields = atQuestionsData.map((q) => q.Question);
  const fieldData = groupBy(atQuestionsData, 'Page');
  const tabs = map(fieldData, (page, index) => ({
    display: get(page, '[0].Stage', `Step ${index + 1}`),
    page: toNumber(index),
  }));
  const submitData = async () => {
    if (!data.airtableId) {
      const response = await fetch(`https://api.airtable.com/v0/${BASE}/${TABEL_NAME}`, {
        method: 'post', // make sure it is a "POST request"
        body: JSON.stringify({ fields: { userId: user._id, ...pick(data, fields) } }),
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
          'Content-Type': 'application/json', // we will recive a json object
        },
      });
      const res = await response.json();
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
  if (!deal) return null;
  return (
    <>
      <Grid container spacing={2} style={{ maxWidth: '50%', marginTop: '-4rem' }}>
        {tabs.map((t) => (
          <Grid
            item
            xs={3}
            sm={3}
            md={3}
            lg={3}
            onClick={() => {
              submitData();
              setPage(t.page);
            }}
          >
            <Typography
              variant="h6"
              style={{ color: 'white', borderBottom: t.page === page ? '5px solid white' : '5px solid transparent' }}
            >
              {t.display}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', margin: '0' }}>
        <Grid xs={12} sm={4} md={4} lg={4} style={{ border: '1rem solid transparent', position: 'relative' }}>
          <Paper
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{
              height: '56vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'fixed',
              width: '24%',
            }}
          >
            <img
              src={
                !deal['What would you like to build?']
                  ? images.basic
                  : images[
                      `${''.concat(
                        (data['What are you investing in?'] || '').replaceAll(' ', '') || '',
                        page >= 3 ? '3' : page.toString(),
                      )}`
                    ]
              }
              alt="oops"
              style={{ width: '100%', height: '100%' }}
            />
          </Paper>
        </Grid>
        {/* Left Column */}
        <Grid xs={12} sm={8} md={8} lg={8} style={{ border: '1rem solid transparent', marginBottom: '2rem' }}>
          {/* Page 1 */}
          {/* Question 1 */}
          <Questions setData={setData} answers={data} classes={classes} activePage={page} />
        </Grid>
        {/* end grid */}
      </Grid>
      <Grid
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{
          display: 'flex',
          margin: '0',
          backgroundColor: '#2676FF',
          color: 'white',
          position: 'fixed',
          bottom: '0',
          width: '90%',
          marginLeft: '-2rem',
          padding: '1rem',
          paddingBottom: '1.5rem',
        }}
      >
        <Grid xs={3} sm={3} md={3} lg={3}>
          <Grid container>
            <Grid
              xs={4}
              sm={4}
              md={4}
              lg={4}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}
            >
              <Typography variant="body1">
                <span style={{ minWidth: '120px' }}> Subtotal </span>
              </Typography>
              <Typography variant="body1">
                <span style={{ minWidth: '120px', marginTop: '1rem' }}> Estimated blue sky fees </span>
              </Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8} lg={8}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', marginLeft: '1rem' }}> $8,000</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', marginLeft: '1rem' }}> $500</div>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={3} sm={3} md={3} lg={3}>
          <Grid container style={{ marginTop: '1rem' }}>
            <Grid
              xs={4}
              sm={4}
              md={4}
              lg={4}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}
            >
              <Typography variant="body1">
                <span style={{ minWidth: '120px' }}> Grand Total </span>
              </Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8} lg={8}>
              <span style={{ fontSize: '2.5rem', fontWeight: '900', marginLeft: '1rem' }}> $8,500</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={2} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1"> Estimated Delivery: {data.closing_time}</Typography>
        </Grid>
        <Grid xs={2} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: '140px',
              border: 'solid 2px white',
              borderRadius: '1rem',
              fontSize: '1.5rem',
              textAlign: 'center',
              padding: '.25rem',
            }}
            className="nextBtn"
            onClick={() => {
              if (page < tabs.length) {
                submitData();
                setPage(page + 1);
                return;
              }
              if (page === tabs.length) {
                submitData();
                setStep('');
                toast.success('Success!');
                postZap({
                  variables: { body: { zapUrl: zapierWebhook, ...data } },
                });
              }
            }}
          >
            {page === tabs.length ? 'Finish' : 'Next'}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

/* <Grid xs={12} sm={4} md={4} lg={4} style={{ border: '1rem solid transparent' }}>
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
      {page < 2 ? (
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
</Grid> */

// HARD CODED QUESTIONS

// {page === 1 && (
//   <>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               What would you like to build?{' '}
//             </Typography>
//             <InfoIcon stye={{ background: 'rgba(0,0,0,0.4)' }} />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['SPV', 'FUND'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.deal_type === t ? '#2676FF' : 'white',
//                   color: data.deal_type === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ deal_type: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>

//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid item xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               What are you investing in?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Startup', 'Crypto', 'Real Estate', 'Custom'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.asset_type === t ? '#2676FF' : 'white',
//                   color: data.asset_type === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ asset_type: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//         </Grid>
//       </Grid>
//     </Paper>

//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid item xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               What is the name of the portfolio company?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
//           <TextField
//             required
//             style={{ width: '100%' }}
//             variant="outlined"
//             label="Company Name"
//             value={data.company_name || ''}
//             onChange={(e) => setData({ company_name: e.target.value })}
//           />
//         </Grid>
//       </Grid>
//     </Paper>

//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid item xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               How soon do you need to close?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.closing_time === t ? '#2676FF' : 'white',
//                   color: data.closing_time === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ closing_time: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//         </Grid>
//       </Grid>
//     </Paper>

//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid item xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               What is the expected wiring date?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
//           <TextField
//             required
//             style={{ width: '100%' }}
//             onChange={(e) => setData({ wiring_date: e.target.value })}
//             label="Wiring Date"
//             type="date"
//             variant="outlined"
//           />
//         </Grid>
//       </Grid>
//     </Paper>

//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Is this a one off SPV or do you plan to do multiple SPVs?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['One Off', 'Multiple'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.num_spvs === t ? '#2676FF' : 'white',
//                   color: data.num_spvs === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ num_spvs: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//   </>
// )}
// {/* Page 2 */}
// {page === 2 && (
//   <>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Will the Organizer charge any management fees?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Yes', 'No'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.org_charge_mgmt_fee === t ? '#2676FF' : 'white',
//                   color: data.org_charge_mgmt_fee === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ org_charge_mgmt_fee: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//     {data.org_charge_mgmt_fee === 'Yes' && (
//       <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid xs={12} sm={12} md={12} lg={12}>
//             <Grid
//               xs={12}
//               sm={12}
//               md={12}
//               lg={12}
//               style={{
//                 padding: '0.5rem',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//                 How much will the Organizer charge as management fees?
//               </Typography>
//               <InfoIcon />
//             </Grid>
//           </Grid>
//           <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//             <TextField
//               required
//               style={{ width: '100%' }}
//               type="number"
//               variant="outlined"
//               label="Fee Amount"
//               value={data.org_charge_mgmt_fee_amount || ''}
//               onChange={(e) => setData({ org_charge_mgmt_fee_amount: e.target.value })}
//             />
//             {/* Spacing */}
//           </Grid>
//         </Grid>
//       </Paper>
//     )}
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Will the Organizer receive any carried interest from profits?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Yes', 'No'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.org_recieve_carry === t ? '#2676FF' : 'white',
//                   color: data.org_recieve_carry === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ org_recieve_carry: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//     {data.org_recieve_carry === 'Yes' && (
//       <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid xs={12} sm={12} md={12} lg={12}>
//             <Grid
//               xs={12}
//               sm={12}
//               md={12}
//               lg={12}
//               style={{
//                 padding: '0.5rem',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//                 Will the Organizer receive any carried interest from profits?
//               </Typography>
//               <InfoIcon />
//             </Grid>
//           </Grid>
//           <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//             <TextField
//               required
//               style={{ width: '100%' }}
//               type="number"
//               variant="outlined"
//               label="Fee Amount"
//               value={data.org_recieve_carry_amount || ''}
//               onChange={(e) => setData({ org_recieve_carry_amount: e.target.value })}
//             />
//           </Grid>
//         </Grid>
//       </Paper>
//     )}
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid item xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Please enter a name for your SPV Series
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
//           <TextField
//             required
//             style={{ width: '100%' }}
//             label="SPV Series Name"
//             variant="outlined"
//             value={data.master_series_name || ''}
//             onChange={(e) => setData({ master_series_name: e.target.value })}
//           />
//         </Grid>
//       </Grid>
//     </Paper>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid item xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               What is the name of the Organizer of the SPV?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
//           <TextField
//             required
//             style={{ width: '100%' }}
//             label="Organizer Name"
//             variant="outlined"
//             value={data.organizer_name || ''}
//             onChange={(e) => setData({ organizer_name: e.target.value })}
//           />
//         </Grid>
//       </Grid>
//     </Paper>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Do you already have the investment agreement for the Portfolio Company?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Yes', 'No'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.has_investment_agreement === t ? '#2676FF' : 'white',
//                   color: data.has_investment_agreement === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ has_investment_agreement: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//   </>
// )}
// {/* Page 3 */}

// {page === 10 && (
//   <>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Do you have a deck or other marketing material from the Portfolio Company?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           <Grid xs={4} sm={4} md={4} lg={4}>
//             <Input
//               type="file"
//               onChange={({ target }) => {
//                 if (target.validity.valid) setData({ attachments: target.files[0] });
//               }}
//             />
//             Upload File(s)
//           </Grid>
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//   </>
// )}
// {page === 3 && (
//   <>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Standard or custom SPV documents?{' '}
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Standard', 'Custom'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.doc_type === t ? '#2676FF' : 'white',
//                   color: data.doc_type === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ doc_type: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               What would you like the minimum investment for the SPV to be?{' '}
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Standard ($5,000)', 'Custom'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.min_investment_amount === t ? '#2676FF' : 'white',
//                   color: data.min_investment_amount === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ min_investment_amount: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Do you have the same fees for all investors in the SPV?{' '}
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Standard', 'Custom'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.same_fees_for_all_investors === t ? '#2676FF' : 'white',
//                   color: data.same_fees_for_all_investors === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ same_fees_for_all_investors: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Standard or custom for the SPV’s investment adviser?
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Standard (In-house)', 'Custom'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.investment_advisor_type === t ? '#2676FF' : 'white',
//                   color: data.investment_advisor_type === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ investment_advisor_type: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//     <Paper style={{ marginBottom: '.25rem', marginTop: '.25rem', padding: '0.5rem' }}>
//       <Grid xs={12} sm={12} md={12} lg={12}>
//         <Grid xs={12} sm={12} md={12} lg={12}>
//           <Grid
//             xs={12}
//             sm={12}
//             md={12}
//             lg={12}
//             style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
//           >
//             <Typography style={{ textAlign: 'left', marginTop: '0.5rem' }} variant="h6">
//               Would you like to do advertising for this offering? (506(c) offering)
//             </Typography>
//             <InfoIcon />
//           </Grid>
//         </Grid>
//         <Grid xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', padding: '0.5rem' }}>
//           {['Yes', 'No'].map((t) => (
//             <Grid xs={4} sm={4} md={4} lg={4}>
//               <Button
//                 variant="outline"
//                 color="#2676FF"
//                 className={classes.button}
//                 style={{
//                   background: data.advertise_investment === t ? '#2676FF' : 'white',
//                   color: data.advertise_investment === t ? 'white' : '#2676FF',
//                 }}
//                 onClick={() => setData({ advertise_investment: t })}
//               >
//                 {t}
//               </Button>
//             </Grid>
//           ))}
//           {/* Spacing */}
//           <Grid xs={4} sm={4} md={4} lg={4} />
//           <Grid xs={4} sm={4} md={4} lg={4} />
//         </Grid>
//       </Grid>
//     </Paper>
//   </>
// )}
