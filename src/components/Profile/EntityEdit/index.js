import React, { useState } from 'react';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloudDone, HourglassEmpty, CheckCircle } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { UsaStates } from 'usa-states';
import {
  Button,
  List,
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
import Loader from '../../utils/Loader';

/** *
 *
 * Investor edit form that is reusable
 *
 * */

const reqs = ['country', 'investor_type', 'signer_full_name', 'email'];

export function validate(investor) {
  const required =
    investor.investor_type === 'entity'
      ? ['entity_name', 'accredited_investor_status', ...reqs]
      : ['first_name', 'last_name', ...reqs];
  return required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);
}

export default function EntityEditForm({
  investor,
  setInvestor,
  actionText,
  icon,
  setFormStatus,
  submitfn,
  deleteEntity,
  isEdit,
  handleClose,
}) {
  const [errors, setErrors] = useState([]);

  const handleChange = (prop) => (e) => {
    e.persist();
    if (prop === 'investor_type') {
      return setInvestor({ [prop]: e.target.value, accredited_investor_status: '' });
    }
    return setInvestor({ [prop]: e.target.value });
  };
  const usStates = new UsaStates();

  if (!investor) return <Loader />;

  return (
    <>
      <form noValidate autoComplete="off" style={{ padding: '16px' }}>
        <Typography variant="h6" gutterBottom>
          Add A New Entity {icon && <FontAwesomeIcon icon={icon} spin={icon === 'circle-notch'} />}
        </Typography>
        <Typography variant="subtitle2" style={{ marginBottom: '16px' }}>
          This information is used to prepopulate documents.
        </Typography>
        <Grid container spacing={3} style={{ marginTop: '16px' }}>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required error={errors.includes('investor_type')} variant="outlined" style={{ width: '100%' }}>
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
          {investor.country === 'United States' && (
            <Grid item xs={6} sm={6} md={6}>
              <FormControl
                required
                //   error={errors.includes('country')}
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel>State</InputLabel>
                <Select value={investor.state || ''} onChange={handleChange('state')} inputProps={{ name: 'state' }}>
                  <MenuItem value="" />
                  {usStates.states.map(({ name }) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

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
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" style={{ marginTop: 16 }} onClick={submitfn} color="primary">
            {actionText}
          </Button>
          {isEdit && (
            <Button
              variant="contained"
              style={{ marginTop: 16, backgroundColor: '#E31919' }}
              onClick={() => {
                return deleteEntity({
                  variables: {
                    accountId: investor.accountId,
                    entityId: investor._id,
                  },
                  onCompleted: handleClose(),
                });
              }}
            >
              Delete
            </Button>
          )}
        </Grid>
      </form>
    </>
  );
}

function KYC({ investor, setInvestor }) {
  const status =
    investor.passport && investor.accredidation_doc ? (
      investor.is_kyced ? (
        <Button variant="contained" size="small" style={{ backgroundColor: '#21ce99' }} startIcon={<CheckCircle />}>
          Approved
        </Button>
      ) : (
        <Button variant="contained" size="small" color="secondary" startIcon={<HourglassEmpty />}>
          Pending
        </Button>
      )
    ) : null;

  return (
    <List>
      <AccredidationUploader investor={investor} setInvestor={setInvestor} />
      <PassportUploader investor={investor} setInvestor={setInvestor} />
    </List>
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

function AccredidationUploader({ investor, setInvestor }) {
  if (investor.accredidation_doc) {
    return (
      <Paper style={{ marginBottom: 16 }}>
        <ListItem>
          <ListItemText primary="Accredited Investor Certificate" secondary="via verifyinvestor.com" />
          <ListItemSecondaryAction>
            <Button variant="contained" color="secondary" size="small" startIcon={<CloudDone />}>
              Uploaded
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </Paper>
    );
  }

  return (
    <Paper style={{ marginBottom: 16 }}>
      <ListItem>
        <ListItemText primary="Accredited Investor Certificate" secondary="via verifyinvestor.com" />
        <ListItemSecondaryAction>
          <Button startIcon={<CloudUploadIcon />} variant="contained" color="secondary" component="label">
            Upload
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={({ target }) => {
                if (target.validity.valid) setInvestor((prev) => ({ ...prev, accredidation_doc: target.files[0] }));
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
    'I have over $5m in net assets, excluding my primary residence',
    'I have over $2m-$5m in net assets, excluding my primary residence',
    'I have over $1m-$2m in net assets, excluding my primary residence',
    'I have had $200K in income (or $300K jointly with my spouse) for the past 2 years and expect the same this year',
    'N.A.',
  ],
  entity: [
    'My entity has over $25m in assets',
    'My entity has $5m-$25m in assets',
    'All owners of my entity are qualified purchasers',
    'All owners of my entity are accredited',
    'N.A.',
  ],
};

export function AccreditedInvestorStatus({ investor, handleChange, errors }) {
  const { investor_type } = investor;
  if (!investor_type) return null;

  return (
    <FormControl
      required
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
