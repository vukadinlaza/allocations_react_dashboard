import React, { useState } from 'react';
import { Grid, Typography, Button, Modal, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
// import Confetti from 'react-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const powerFormLink =
  'https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=4967a16a-d608-4192-a473-5f2a54f9e330&env=na3&acct=5ff4424d-446e-45ab-a456-3382543498de&v=2';
const useStyles = makeStyles((theme) => ({
  landingContainer: {
    minWidth: '100vw',
    minHeight: '100vh',
    background: 'transparent linear-gradient(127deg, #2576FF 0%, #4F8EFA 100%) 0% 0% no-repeat padding-box;',
  },
  centerGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
    minHeight: '100vh',
    flexDirection: 'column',
  },
}));
export default ({ deal, user }) => {
  const classes = useStyles();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  if (!user.email || !deal) {
    return null;
  }
  const advisorName =
    (deal['Would you like to hire Allocations as the exempt reporting advisor?'] || '').trim() === 'Yes'
      ? 'Sharding Advisers LLC'
      : '';
  const adviserQTY =
    (deal['Would you like to hire Allocations as the exempt reporting advisor?'] || '').trim() === 'Yes' ? 1 : 0;
  const adviserCost =
    (deal['Would you like to hire Allocations as the exempt reporting advisor?'] || '').trim() === 'Yes'
      ? '$2000.00'
      : '$0.00';
  const clientInfo = `${deal.Address || ''}. ${user.email || ''} ${deal['Phone number'] || ''}`;

  const fees = `Management Fee: ${deal['Choose your management fee']}%. Carry: ${deal['Choose your carry']}%.`;
  const masterPartnerName = deal['Choose your speed'] === 'Express' ? 'Sharding Holdings Management LLC' : '';
  const params = {
    'build-asset-type': deal['Choose your asset type'] || '',
    'build-offering-type': deal['Choose offering type'] || '',
    'build-adviser-name': advisorName || '',
    'build-target-company-name': deal['Enter name of portfolio company'] || '',
    'build-initial-closing-date': deal['Choose your wiring date'] || '',
    'build-organizer-name': deal['Choose the name of your manager'] || '',
    'build-carried-interest-other-fees': fees || '',
    'build-master-limit-partner-company-name': masterPartnerName || '',
    'build-advisor-quantity': adviserQTY || '',
    'build-adviser-subtotal': adviserCost || '0.00',
    'build-client-company-name': deal['Company name'],
    'client-info': clientInfo,
    'build-company-individual': `${deal['Company name']} (${deal.Name})`,
  };
  const urlParameters = Object.entries(params)
    .map((e) => e.map(encodeURI).join('='))
    .join('&');
  const link = `${powerFormLink}&signer_UserName=${user.first_name || ''} ${user.last_name || ''}&signer_Email=${
    user.email
  }&${urlParameters}`;
  return (
    <div className={classes.landingContainer}>
      <Grid className={classes.centerGrid}>
        {/* <Confetti /> */}

        <img src="https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-custom+(3).svg" />
        <Typography
          variant="title1"
          style={{ color: 'white', marginTop: '1rem', marginBottom: '.25rem', fontSize: '2rem' }}
        >
          Congratulations on submitting your first SPV!
        </Typography>
        <Typography style={{ color: 'white', fontSize: '1rem' }}>
          We will be in touch with you shortly to talk next steps!{' '}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('/')}
          style={{
            fontSize: '1.5rem',
            margin: '1rem',
            backgroundColor: '#2576FF',
            borderRadius: '2rem',
            padding: '.5rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            marginTop: '2rem',
          }}
        >
          Go back to Allocations Home
        </Button>
        {deal['Choose your fund type'] === 'SPV' && (
          <>
            <Typography style={{ color: 'white', fontSize: '2rem', marginTop: '.25rem' }}>Or</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowModal(true)}
              style={{
                fontSize: '1.5rem',
                margin: '1rem',
                backgroundColor: '#2576FF',
                borderRadius: '2rem',
                padding: '.5rem',
                paddingLeft: '2rem',
                paddingRight: '2rem',
                marginTop: '2rem',
              }}
            >
              Sign Services Agreement
            </Button>
          </>
        )}
        <Modal
          open={showModal}
          // onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5vh',
          }}
        >
          <Paper
            style={{
              width: '90vw',
              height: '90vh',
              padding: '1rem',
              overflow: 'scroll',
            }}
          >
            <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CloseIcon style={{ padding: '.5rem', width: '2rem' }} />
            </Grid>
            <div>
              <div className="external-sign-link">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <h3>
                    <FontAwesomeIcon icon="signature" /> Open Directly
                  </h3>
                </a>
              </div>
              <div className="embed-responsive embed-responsive-1by1">
                <iframe className="embed-responsive-item" title="Wire Instructions" src={link} />
              </div>
            </div>
          </Paper>
        </Modal>
      </Grid>
    </div>
  );
};
