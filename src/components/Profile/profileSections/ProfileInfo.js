import React, { useEffect, useState } from 'react';
import { get, pick } from 'lodash';
import { toast } from 'react-toastify';
import { useMutation, gql } from '@apollo/client';
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
  Avatar,
  Badge,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import countries from 'country-region-data';
import { UsaStates } from 'usa-states';
import Sectors from './Sectors';
import Loader from '../../utils/Loader';
import { useAuth } from '../../../auth/useAuth';
import './sections.scss';

const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
      first_name
      last_name
      country
      state
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      username
      sectors
      linkedinUrl
      display_username
      passport {
        link
        path
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #8493A640 !important',
    borderRadius: '10px',
    overflowX: 'none',
    width: '100%',
    height: '100%',
  },
  accreditedInvestorStatus: {
    marginTop: '15px',
    left: '20px',
    padding: '5px',
    width: '90%',
  },
  linkedin: {
    color: 'blue',
  },
  paperTitle: {
    padding: '.5rem',
    paddingLeft: '1rem',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paperMain: {
    background: '#f1f4fb',
    padding: '.5rem',
    paddingBottom: '1.5rem',
    paddingRight: '1rem',
    borderTop: '1px solid #8493A640 !important',
  },
  avatar: {
    width: theme.spacing(13),
    height: theme.spacing(13),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  },
}));

const reqs = ['country', 'investor_type', 'signer_full_name', 'email'];

export function validate(investor) {
  const required =
    investor.investor_type === 'entity'
      ? ['entity_name', 'accredited_investor_status', ...reqs]
      : ['first_name', 'last_name', ...reqs];
  return required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);
}

const ProfileInfo = ({ investor, setInvestor, actionText, setFormStatus, noValidate = false }) => {
  const classes = useStyles();
  const { logout, userProfile } = useAuth();
  const [errors, setErrors] = useState([]);

  const { display_username } = investor;
  const currentSwitchStatus = display_username === true;
  const [checked, setChecked] = React.useState(currentSwitchStatus);

  const logoutWithRedirect = () => logout({ returnTo: process.env.REACT_APP_URL });

  const [updateInvestor, updateInvestorRes] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      if (userProfile.email !== investor.email) {
        logoutWithRedirect();
      } else {
        toast.success('Success! User Updated');
      }
    },
  });

  const handleChange = (prop) => (e) => {
    e.persist();

    if (prop === 'first_name' || prop === 'last_name' || prop === 'signer_full_name') {
      const capitalizeName = (str) =>
        str
          .toLowerCase()
          .replace(/\w{0,}/g, (match) => match.replace(/\w/, (m) => m.toUpperCase()));

      return setInvestor((prev) => ({
        ...prev,
        [prop]: capitalizeName(e.target.value),
      }));
    }

    if (prop === 'investor_type') {
      return setInvestor((prev) => ({
        ...prev,
        [prop]: e.target.value,
        accredited_investor_status: '',
      }));
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

  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 22,
      height: 22,
      [theme.breakpoints.down('sm')]: {
        width: 15,
        height: 15,
      },
      border: `2px solid ${theme.palette.background.paper}`,
      backgroundColor: theme.palette.primary.main,
    },
  }))(Avatar);

  const EditAvatar = withStyles((theme) => ({
    root: {
      width: 15,
      height: 15,
      [theme.breakpoints.down('sm')]: {
        width: 10,
        height: 10,
      },
    },
  }))(EditIcon);

  const usStates = new UsaStates();
  const stateNames = usStates.states.map((s) => s.name);

  /* toggle for username display */
  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="Sections">
      {/* main grid for all sections */}
      <Grid container spacing={2}>
        {/* grid container for info section */}
        <Grid item md={6}>
          <Paper className={classes.paper}>
            <Grid container style={{ height: '100%' }}>
              <Grid item xs={12} className={classes.paperTitle}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
              </Grid>

              {/* main section for personal info */}
              <Grid
                container
                spacing={2}
                className={classes.paperMain}
                style={{ border: 'solid red 3px' }}
              >
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center' }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        badgeContent={
                          <SmallAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg">
                            <EditAvatar />
                          </SmallAvatar>
                        }
                      >
                        <Avatar
                          alt="avatar"
                          src="/static/images/avatar/2.jpg"
                          style={{ border: 'solid yellow 3px' }}
                          className={classes.avatar}
                        />
                      </Badge>
                    </Grid>

                    <Grid item xs={12} sm={10}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            error={errors.includes('first_name')}
                            value={get(investor, 'first_name') || ''}
                            onChange={handleChange('first_name')}
                            style={{ background: 'white' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="last-name"
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            error={errors.includes('last_name')}
                            value={get(investor, 'last_name') || ''}
                            onChange={handleChange('last_name')}
                            style={{ background: 'white' }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    style={{ background: 'white', width: '100%' }}
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

                <Grid item xs={12}>
                  <TextField
                    id="country"
                    select
                    fullWidth
                    style={{ background: 'white' }}
                    label="Country of Residence"
                    value={investor.country || ''}
                    onChange={handleChange('country')}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                  >
                    {countries.map(({ countryName }) => (
                      <option key={countryName} value={countryName}>
                        {countryName}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    style={{ background: 'white' }}
                    label="State"
                    value={investor.state || ''}
                    onChange={handleChange('state')}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                  >
                    {stateNames.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={investor.username || ''}
                    onChange={handleChange('username')}
                    fullWidth
                    style={{ background: 'white' }}
                  />
                </Grid>
                <Grid container justifyContent="center">
                  <Grid item xs={10} style={{ padding: '10px' }}>
                    <Typography>Display username on pblic pages instead of real name:</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch size="medium" checked={checked} onChange={toggleChecked} />
                        }
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item sm={12} md={6}>
          {/* grid container for investor section */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={12} className={classes.paperTitle}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                      Investor Information
                    </Typography>
                  </Grid>

                  <Grid container spacing={2} className={classes.paperMain}>
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        required
                        error={errors.includes('investor_type')}
                        variant="outlined"
                        fullWidth
                        style={{ background: 'white' }}
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
                      <Grid item xs={12}>
                        <AccreditedInvestorStatus
                          investor={investor}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </Grid>
                    )}

                    {investor.investor_type === 'entity' && (
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          error={errors.includes('entity_name')}
                          style={{ background: 'white' }}
                          value={get(investor, 'entity_name') || ''}
                          onChange={handleChange('entity_name')}
                          label="Subscriber Entity Name"
                          variant="outlined"
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* grid container for interests section */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={12} className={classes.paperTitle}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                      Interests
                    </Typography>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    className={classes.paperMain}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Sectors investor={investor} style={{ width: '100%' }} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* grid container for social section */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12} className={classes.paperTitle}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  Social Profile Connect
                </Typography>
              </Grid>

              <Grid container spacing={1} className={classes.paperMain}>
                <Grid
                  item
                  xs={1}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <LinkedInIcon className={classes.linkedin} />
                </Grid>
                <Grid item xs={11}>
                  <TextField
                    id="linkedin"
                    /* add the value= */
                    label="Linkedin Profile Link"
                    variant="outlined"
                    fullWidth
                    style={{ background: 'white' }}
                    error={errors.includes('linkedinUrl')}
                    value={get(investor, 'linkedinUrl') || ''}
                    onChange={handleChange('linkedinUrl')}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={submit} color="primary">
            {actionText}
          </Button>
        </Grid>
      </Grid>

      {/* old code to reference
      <Paper>
        <form noValidate autoComplete="off" style={{ padding: '16px' }}>
          <Grid container spacing={3} style={{ marginTop: '16px' }}>
            <Grid item xs={12}>
              <FormControl
                required
                error={errors.includes('investor_type')}
                variant="outlined"
                style={{ width: '100%', background: 'white' }}
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
              <Grid item xs={12}>
                <AccreditedInvestorStatus
                  investor={investor}
                  handleChange={handleChange}
                  errors={errors}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={12}>
              <FormControl
                required
                error={errors.includes('country')}
                variant="outlined"
                style={{ width: '100%' }}
              >
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
      </Paper> */}
    </div>
  );
};

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
      style={{ background: 'white' }}
      required
      error={errors.includes('accredited_investor_status')}
      variant="outlined"
      fullWidth
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

export default ProfileInfo;
