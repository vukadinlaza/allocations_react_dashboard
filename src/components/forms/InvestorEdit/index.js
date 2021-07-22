import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';
import { get, pick } from 'lodash';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloudDone } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import {
  Button,
  TextField,
  Paper,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import './style.scss';
import countries from 'country-region-data';
import Typography from '@material-ui/core/Typography';
import { useAuth } from '../../../auth/useAuth';

/** *
 *
 * Investor edit form that is reusable
 *
 * */

const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
      first_name
      last_name
      country
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`;

const reqs = ['country', 'investor_type', 'signer_full_name', 'email'];

export function validate(investor) {
  const required =
    investor.investor_type === 'entity'
      ? ['entity_name', 'accredited_investor_status', ...reqs]
      : ['first_name', 'last_name', ...reqs];
  return required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);
}

export default function InvestorEditForm({
  investor,
  setInvestor,
  actionText,
  icon,
  setFormStatus,
  noValidate = false,
}) {
  const [errors, setErrors] = useState([]);
  const [updateInvestor, updateInvestorRes] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (userProfile.email !== investor.email) {
        logoutWithRedirect();
      } else {
        toast.success('Success');
      }
    },
  });

  const { logout, userProfile } = useAuth();
  const logoutWithRedirect = () => logout({ returnTo: process.env.REACT_APP_URL });

  const handleChange = (prop) => (e) => {
    e.persist();

    if (prop === 'first_name' || prop === 'last_name' || prop === 'signer_full_name') {

      const capitalizeName = (str) =>
        str.toLowerCase().replace(/\w{0,}/g, (match) =>
          match.replace(/\w/, (m) => m.toUpperCase()));

      return setInvestor((prev) => ({
        ...prev,
        [prop]: capitalizeName(e.target.value)
      }));
    }

    if (prop === 'investor_type') {
      return setInvestor((prev) => ({ ...prev, [prop]: e.target.value, accredited_investor_status: '' }));
    }
    return setInvestor((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  const submit = () => {
    // don't validate if noValidate flag passed
    if (noValidate) return updateInvestor({ variables: { investor } });
    const validation = validate(investor);
    const required =
      investor.investor_type === 'entity'
        ? ['entity_name', 'accredited_investor_status', ...reqs]
        : ['first_name', 'last_name', ...reqs];
    const payload = pick(investor, [...required, '_id']);
    setErrors(validation);

    if (validation.length === 0) {
      if (get(investor, 'email') !== userProfile.email) {
        if (window.confirm('Changing your email will log you out, continue?')) {
          updateInvestor({
            variables: { investor: payload },
          });
        }
      } else {
        updateInvestor({
          variables: { investor: payload },
        });
      }
    }
  };

  useEffect(() => {
    if (updateInvestorRes.data) setFormStatus('complete');
    if (updateInvestorRes.loading) setFormStatus('loading');
  }, [setFormStatus, updateInvestorRes]);

  if (!investor || !userProfile.email) return <Loader />;

  return (
    <>
      <Paper>
        <form noValidate autoComplete="off" style={{ padding: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Profile {icon && <FontAwesomeIcon icon={icon} spin={icon === 'circle-notch'} />}
          </Typography>
          <Typography variant="subtitle2" style={{ marginBottom: '16px' }}>
            This information can be edited from your profile page.
          </Typography>
          <Grid container spacing={3} style={{ marginTop: '16px' }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormControl
                required
                error={errors.includes('investor_type')}
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel>Investor Type</InputLabel>
                <Select
                  value={investor.investor_type || ''}
                  onChange={handleChange('investor_type')}
                  inputProps={{ name: 'Type' }}
                >
                  <MenuItem value="" />
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="entity">Entity</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {investor.investor_type === 'entity' && (
              <Grid item xs={12} sm={12} md={6}>
                <AccreditedInvestorStatus investor={investor} handleChange={handleChange} errors={errors} />
              </Grid>
            )}

            <Grid item xs={12} sm={12} md={6}>
              <FormControl required error={errors.includes('country')} variant="outlined" style={{ width: '100%' }}>
                <InputLabel>Country of Residence or Place of Business</InputLabel>
                <Select
                  value={investor.country || ''}
                  onChange={handleChange('country')}
                  inputProps={{ name: 'Country' }}
                >
                  <MenuItem value="" />
                  {[{ countryName: 'United States' }, ...countries].map(({ countryName }) => (
                    <MenuItem key={countryName} value={countryName}>
                      {countryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <FormControl
                required
                disabled
                error={errors.includes('country')}
                variant="outlined"
                style={{ width: '100%' }}
              >
                <TextField
                  error={errors.includes('email')}
                  style={{ width: '100%' }}
                  value={get(investor, 'email') || ''}
                  onChange={handleChange('email')}
                  label="Email"
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <InvestorName investor={investor} errors={errors} handleChange={handleChange} />

            <Grid item xs={12} sm={12} md={6}>
              <TextField
                required
                error={errors.includes('signer_full_name')}
                style={{ width: '100%' }}
                value={get(investor, 'signer_full_name') || ''}
                onChange={handleChange('signer_full_name')}
                label="Full Name of Signer"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Button variant="contained" style={{ marginTop: 16 }} onClick={submit} color="primary">
            {actionText}
          </Button>
        </form>
      </Paper>
    </>
  );
}

export function PassportUploader({ investor, setInvestor }) {
  if (investor.passport) {
    return (
      <Paper>
        <div className="file-uploader">
          <ListItem>
            <ListItemText primary="ID for KYC" secondary="passport / drivers license" />
            <ListItemSecondaryAction>
              <Button variant="contained" color="secondary" size="small" startIcon={<CloudDone />}>
                Uploaded
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </div>
      </Paper>
    );
  }

  return (
    <Paper>
      <ListItem>
        <ListItemText primary="ID for KYC" secondary="passport / drivers license" />
        <ListItemSecondaryAction>
          <Button startIcon={<CloudUploadIcon />} variant="contained" color="secondary" component="label">
            Upload
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={({ target }) => {
                if (target.validity.valid) setInvestor((prev) => ({ ...prev, passport: target.files[0] }));
              }}
            />
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    </Paper>
  );
}

function InvestorName({ investor, errors, handleChange }) {
  if (investor.investor_type === 'entity') {
    return (
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          required
          error={errors.includes('entity_name')}
          style={{ width: '100%' }}
          value={get(investor, 'entity_name') || ''}
          onChange={handleChange('entity_name')}
          label="Subscriber Entity Name"
          variant="outlined"
        />
      </Grid>
    );
  }
  return (
    <>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          required
          error={errors.includes('first_name')}
          style={{ width: '100%' }}
          value={get(investor, 'first_name') || ''}
          onChange={handleChange('first_name')}
          label="Subscriber First Name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          required
          error={errors.includes('last_name')}
          style={{ width: '100%' }}
          value={get(investor, 'last_name') || ''}
          onChange={handleChange('last_name')}
          label="Subscriber Last Name"
          variant="outlined"
        />
      </Grid>
    </>
  );
}
const statusOptions = {
  individual: [
    'I have individual/joint net worth in excess of $1m',
    'I have had $200K+ income in each of the two most recent years',
    'I’ve had $300K+ joint income in each of the two most recent years',
    'My professional certification qualifies me as an accredited investor',
    'I am a director or executive officer of the Fund’s General Partner',
    'I am a “knowledgeable employee" of the private fund or its managers',
    'I am a foreigner within the meaning of Section 1446(e) of the Code',
  ],
  entity: [
    'Each equity owner of my entity is an accredited investor',
    'My entity has total assets in excess of $5m',
    'I am a “family office” with $5m+ in assets under management',
    'I am an Investment Advisor',
    'I am an Exempt Investment Adviser',
    'I am a private business development company',
    'I am an investment company or a business development company',
    'I am a Small Business Investment Company',
  ],
};

export function AccreditedInvestorStatus({ investor, handleChange, errors }) {
  const { investor_type } = investor;
  if (!investor_type) return null;

  return (
    <FormControl
      required
      className="accredited-investor-status"
      error={errors.includes('accredited_investor_status')}
      variant="outlined"
      fullWidth
      style={{ width: '100%' }}
    >
      <InputLabel htmlFor="outlined-age-native-simple">Accredited Investor Type</InputLabel>
      <Select
        value={investor.accredited_investor_status || ''}
        onChange={handleChange('accredited_investor_status')}
        inputProps={{ name: 'Accredited Investor Status' }}
      >
        <MenuItem value="" />
        {statusOptions[investor_type].map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
