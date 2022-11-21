import {
  Button,
  Checkbox,
  colors,
  Icon,
  Input,
  Logo,
  Modal,
  Typography,
} from '@allocations/design-system';
import { openInNewTab, validateEmail } from '@allocations/nextjs-common';
import { gql, useMutation } from '@apollo/client';
import { Grid, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
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

const fields = [
  {
    name: 'client_name',
    label: 'Client Name',
  },
  {
    name: 'full_name',
    label: 'Full Name',
  },
  {
    name: 'title',
    label: 'Title',
  },
  {
    name: 'email',
    label: 'Email',
  },
];

const TextCheck = ({ text, style }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.checkTextContainer} style={style}>
      <Icon iconColor="#B5CEF9" iconName="check_circle" />
      <span className={classes.checkText}>
        <Typography
          content={text}
          variant="paragraph2"
          fontWeight={400}
          fontColor={colors.white[100]}
        />
      </span>
    </Grid>
  );
};

export default function AssureMigrations() {
  const classes = useStyles();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState('');
  const [accepted, setAccepted] = useState(false);
  // const [transfer, setTransfer] = useState('');
  // const [getTransitionDocument] = useMutation(GET_TRANSITION_DOCUMENT, {
  //   onError: () => {
  //     toast.error(
  //       'Sorry, something went wrong. Try again or contact support at support@allocations.com',
  //     );
  //   },
  //   onCompleted: ({ getTransitionDocument }) => {
  //     console.log({ getTransitionDocument });
  //     setTransfer(getTransitionDocument.transfer_id);
  //     setOpenModal(getTransitionDocument.download_url);
  //   },
  // });
  // const [updateDataTransition] = useMutation(UPDATE_DATA_TRANSITION, {
  //   onError: () => {
  //     toast.error(
  //       'Sorry, something went wrong. Try again or contact support at support@allocations.com',
  //     );
  //   },
  //   onCompleted: ({ data }) => {
  //     console.log({ data });
  //   },
  // });

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

  const updateForm = (target) => {
    setForm({ ...form, [target.name]: target.name === 'terms' ? target.checked : target.value });
  };

  const validateFields = () => {
    let validated = true;
    const errorsFound = {};
    fields.forEach((field) => {
      if (validated) {
        const isValid = !!form[field.name];
        if (!isValid) {
          errorsFound[field.name] = 'This field is required';
        } else {
          errorsFound[field.name] = '';
        }
        validated = isValid;
      }
      if (validated && field.name === 'email') {
        const isValidEmail = !!validateEmail(form[field.name]);
        if (!isValidEmail) {
          errorsFound[field.name] = 'Email is not valid';
        } else {
          errorsFound[field.name] = '';
        }
        validated = isValidEmail;
      }
    });
    if (errorsFound) setErrors(errorsFound);
    return validated;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;
    setOpenModal(true);
  };

  return (
    <Grid container spacing={0} className={classes.mainContainer}>
      <Grid item xs={6} className={classes.leftSide}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              content="Welcome Assure Clients."
              variant="heading4"
              fontWeight={700}
              fontColor={colors.white[100]}
            />
            <Typography
              content="Migrate to Allocations in a few clicks 🚀"
              variant="heading4"
              fontWeight={700}
              fontColor={colors.white[100]}
            />
            <div style={{ marginTop: '8px' }}>
              <Typography
                content="Simple, fast and efficient process"
                variant="paragraph2"
                fontWeight={400}
                fontColor={colors.white[100]}
              />
            </div>
          </Grid>
          <TextCheck text="Free secure data storage" style={{ marginTop: '20px' }} />
          <TextCheck
            text="Technology platform with GP / LP dashboard"
            style={{ marginTop: '20px' }}
          />
          <TextCheck text="Professional services including" style={{ marginTop: '20px' }} />
          <Grid item xs={12} className={classes.subChecks}>
            <Grid container spacing={2}>
              <TextCheck text="Fund administration" />
              <TextCheck text="Tax returns" />
              <TextCheck text="Banking" />
              <TextCheck text="Change of manager" />
              <TextCheck text="Compliance services" />
              <TextCheck text="Transfer of master entity" />
              <TextCheck text="Post-closing activities" />
              <TextCheck text="Investment advisory services" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6} className={classes.rightSide}>
        {!accepted ? (
          <Paper className={classes.formContainer}>
            <Logo width={300} />
            {fields.map((field, index) => (
              <span className={classes.input} key={`field-${index}`}>
                <Input
                  onChange={({ target }) => updateForm(target)}
                  label={field.label}
                  name={field.name}
                  type="text"
                  value={form[field.name]}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                />
              </span>
            ))}
            <div className={classes.termsContainer}>
              <span className={classes.checkbox}>
                <Checkbox
                  name="terms"
                  onChange={({ target }) => updateForm(target)}
                  checked={form.terms}
                />
              </span>
              <span className={classes.text}>
                <Typography
                  variant="paragraph3"
                  fontWeight={400}
                  content="By clicking here, I accept Allocations"
                  component="span"
                />
              </span>
              <span className={classes.textSpace} />
              <span
                onClick={() => openInNewTab('//allocations.com/privacy-policy')}
                className={classes.terms}
              >
                <Typography
                  variant="paragraph3"
                  fontColor={colors.brand[300]}
                  fontWeight={500}
                  content="Privacy Policy"
                  component="span"
                />
              </span>
              <span className={classes.textSpace} />
              <Typography variant="paragraph3" fontWeight={400} content="and" component="span" />
              <span className={classes.textSpace} />
              <span
                onClick={() => openInNewTab('//allocations.com/terms-and-conditions')}
                className={classes.terms}
              >
                <Typography
                  variant="paragraph3"
                  fontColor={colors.brand[300]}
                  fontWeight={500}
                  content=" Terms and Conditions"
                  component="span"
                />
              </span>
            </div>
            <Button onClick={handleSubmit} text="Continue" fullWidth disabled={!form.terms} />
          </Paper>
        ) : (
          <Paper className={classes.thankyou}>
            <Logo width={300} />
            <Typography content="Thank You!" variant="heading4" fontWeight={500} />
            <Typography
              variant="paragraph3"
              fontWeight={400}
              content="Your migration process has started! We have alerted Assure that you would like to migrate your information to Allocations. We are working on the process. Please click below to set up your account with Allocations."
              component="span"
            />
            <Button
              onClick={() => openInNewTab('https://dashboard.allocations.com')}
              text="Create Account Now"
              fullWidth
            />
          </Paper>
        )}
      </Grid>
      <Modal
        open={!!openModal}
        modalTitle="Sign Data Storage and Privacy Notice"
        onClose={() => setOpenModal(null)}
        primaryButtonProps={{
          onClick: () => {
            acceptTransitionDocument({
              variables: {
                payload: form,
              },
            });
            setOpenModal(null);
          },
          text: 'I Accept',
        }}
        secondaryButtonProps={{
          onClick: () => setOpenModal(null),
          text: 'I Decline',
        }}
        withSecondaryButton
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <iframe
              src="https://allocations-public.s3.us-east-2.amazonaws.com/Data+Storage+and+Privacy+Notice.pdf"
              className={classes.documentIframe}
              title="Sign Data Storage and Privacy Notice"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <Typography
              content={`By clicking “I Accept”, I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on documents, including legally binding contracts - just the same as a pen-and-paper signature or initial `}
              variant="caption"
              fontWeight={500}
              component="div"
              fontColor={colors.gray[400]}
            />
          </Grid> */}
        </Grid>
      </Modal>
    </Grid>
  );
}
