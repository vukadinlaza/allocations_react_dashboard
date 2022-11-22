import { IconButton, Modal, Typography } from '@allocations/design-system';
import { gql, useMutation } from '@apollo/client';
import {
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  Grid,
} from '@material-ui/core';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getClientIp } from '../../utils/ip';
import AllocationsBenefits from './AllocationsBenefits';
import DataStorageForm from './DataStorageForm';
import useStyles from './styles';

const ACCEPT_TRANSITION_DOCUMENT = gql`
  mutation AcceptTransitionDocument($payload: Object!) {
    acceptTransitionDocument(payload: $payload)
  }
`;
// const GET_TRANSITION_DOCUMENT = gql`
//   mutation GetTransitionDocument($payload: Object!) {
//     getTransitionDocument(payload: $payload)
//   }
// `;
// const UPDATE_DATA_TRANSITION = gql`
//   mutation UpdateDataTransition($accepted: Boolean!, $transfer_id: String!) {
//     updateDataTransition(accepted: $accepted, transfer_id: $transfer_id)
//   }
// `;

export default function AssureMigrations() {
  const classes = useStyles();
  const [form, setForm] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openDecline, setOpenDecline] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [countryCode, setCountryCode] = useState('');

  const [acceptTransitionDocument] = useMutation(ACCEPT_TRANSITION_DOCUMENT, {
    onError: () => {
      toast.error(
        'Sorry, something went wrong. Try again or contact support at support@allocations.com',
      );
    },
    onCompleted: ({ acceptTransitionDocument }) => {
      if (acceptTransitionDocument?.acknowledged) setAccepted(true);
    },
  });

  return (
    <Grid container spacing={0} className={classes.mainContainer}>
      <AllocationsBenefits />
      <DataStorageForm
        accepted={accepted}
        setOpenModal={setOpenModal}
        setForm={setForm}
        form={form}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
      />

      <Modal
        open={!!openModal}
        modalTitle="Sign Data Storage and Privacy Notice"
        onClose={() => setOpenModal(false)}
        className={classes.modal}
        primaryButtonProps={{
          onClick: async () => {
            acceptTransitionDocument({
              variables: {
                payload: {
                  ...form,
                  ip_address: await getClientIp(),
                  user_agent: navigator.userAgent,
                  phone: `(${countryCode})${form.phone}`,
                },
              },
            });
            setOpenModal(false);
          },
          text: 'I Accept',
        }}
        secondaryButtonProps={{
          onClick: () => {
            setOpenDecline(true);
          },
          text: 'I Decline',
        }}
        withSecondaryButton
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <iframe
              src="https://allocations-public.s3.us-east-2.amazonaws.com/Data+Storage+and+Privacy+Notice+-+v2.pdf"
              className={classes.documentIframe}
              title="Sign Data Storage and Privacy Notice"
            />
          </Grid>
          <Modal
            open={!!openDecline}
            modalTitle="Decline Confirmation"
            onClose={() => setOpenDecline(false)}
            primaryButtonProps={{
              onClick: () => setOpenDecline(false),
              text: 'No. Go Back',
            }}
            secondaryButtonProps={{
              onClick: () => {
                setOpenDecline(false);
                setOpenModal(false);
              },
              text: 'Yes. I am sure',
            }}
            withSecondaryButton
          >
            <div className={classes.warning}>
              <IconButton
                allocationsIconName="Allocations"
                iconColor="#2E75EF"
                iconName="warning"
                size="large"
                variant="default"
                outlined
              />
            </div>
            <Typography
              variant="paragraph3"
              fontWeight={400}
              content="Are you sure you would like to decline the Data Privacy Transfer Agreement? Assure
                will delete your data soon."
              component="div"
              align="center"
            />
          </Modal>
        </Grid>
      </Modal>
    </Grid>
  );
}
