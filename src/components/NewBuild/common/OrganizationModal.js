import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  Container,
  Modal,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core/styles';
import { phone } from '../../../utils/helpers';
import plusSignIcon from '../../../assets/plus-vector.svg';
import plusSignBlackIcon from '../../../assets/plus-vector-black.svg';
import { useAuth } from '../../../auth/useAuth';
import { useHistory } from 'react-router';
import { useSetCurrentOrganization } from '../../../state/current-organization';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import countries from 'country-region-data';
import states from 'usa-states';

const CREATE_ORG = gql`
  mutation CreateOrganization($organization: OrganizationInput!) {
    createOrganization(organization: $organization) {
      _id
      name
      slug
      masterEntity {
        name
        address
        addressLineTwo
        city
        state
        zipCode
        country
      }
    }
  }
`;

const useStyles = makeStyles((theme) => {
  const modalMarginMap = {
    select_org: '10vh',
    create_new_org: '10vh',
    additional_info: '5vh',
    default: '8vh',
  };
  return {
    modal: {
      marginTop: ({ page }) => modalMarginMap[page] || modalMarginMap.default,
      display: 'flex',
      justifyContent: 'center',
    },
    modalContainer: {
      width: '568px',
      height: '328',
    },
    formControl: {
      width: '100%',
      height: '275px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalPaperTitle: {
      height: '67px',
      borderRadius: '8px 8px 0 0 ',
      padding: '18px 29px',
      // maxHeight: 'calc(100% - 8vh)',
      borderBottom: 'solid #E5E5E5 1px',
    },
    modalPaperBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      margin: '.5rem',
      padding: '1rem',
      marginTop: '0px',
      marginBottom: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderRadius: '8px',
      boxShadow: 'none !important',
      border: 'none !important',
    },
    helpIcon: {
      marginLeft: '0.2em',
      cursor: 'pointer',
      color: '#205DF5',
      fontSize: '15px',
    },
    formItemName: {
      alignSelf: 'flex-start',
      color: '#2A2B54',
      font: 'normal normal bold 14px Roboto',
      marginBottom: '10px',
      [theme.breakpoints.down(phone)]: {
        marginBottom: '14px',
        marginLeft: '8px',
      },
    },
    inputBox: {
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      boxShadow: '0px 3px 6px #0000000A',
      padding: '0px',
      maxWidth: '472px',
      width: '100%',
      '& .MuiOutlinedInput-notchedOutline': {
        height: '48px',
        borderRadius: '8px',
        borderColor: '#CBD5E1',
        top: '-8px',
      },
      '& .MuiOutlinedInput-input': {
        fontSize: '14px',
      },
    },
    orgSelect: {
      width: '472px',
      borderRadius: '8px !important',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#CBD5E1',
        height: '48px',
        top: '0px',
      },
    },
    createNewOrgMenuItem: {
      display: 'flex',
      alignItems: 'center',
      color: '#186EFF',
    },
    createNewOrgMenuItemIcon: {
      width: '12px',
      marginRight: '8px',
    },
    typeGroup: {
      width: '100%',
      // margin: '20px',
      flexDirection: 'row',
    },
    selectTitle: {
      alignSelf: 'flex-start',
      marginBottom: '10px',
      color: '#000',
      fontSize: '16px',
      fontWeight: '500',
    },
    dropDownMenu: {
      height: '225px',
      overflowY: 'scroll',
    },
    countrySelect: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '8px',
        borderColor: '#CBD5E1',
        height: '48px',
        top: '0px',
      },
      '& .MuiSelect-select.MuiSelect-select': {
        fontSize: '14px',
      },
    },
    stateSelect: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '8px',
        borderColor: '#CBD5E1',
        height: '48px',
        top: '1px',
      },
      '& .MuiSelect-select.MuiSelect-select': {
        fontSize: '14px',
      },
    },
    continueButton: {
      marginTop: '20px',
      width: '472px',
      // height: '48px',
      borderRadius: '8px',
      backgroundColor: '#186EFF',
      '&:hover': {
        backgroundColor: '#0558E7',
      },
      '&:focus': {
        backgroundColor: '#0558E7',
      },
      '&:disabled': {
        backgroundColor: '#CBD5E1',
      },
      '&:active': {
        backgroundColor: '#0444B4',
      },
    },
    previousButton: {
      marginTop: '11px',
      padding: '5px',
      cursor: 'pointer',
      [theme.breakpoints.down(phone)]: {
        marginBottom: '14px',
        marginTop: '0px',
        marginLeft: '0',
        width: '100%',
        textAlign: 'center',
      },
    },
  };
});

const SelectOrganization = ({
  isOpen,
  closeModal,
  setPage,
  classes,
  dealType,
  history,
  openTooltip,
  handleTooltip,
  openNewBuildModal,
  setCurrentOrganization,
}) => {
  const { loading: userLoading, userProfile } = useAuth();
  const [organizations, setOrganizations] = useState(userProfile?.organizations_admin || []);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    if (!organizations?.length) setOrganizations(userProfile?.organizations_admin);
  }, [userLoading]);

  return (
    <Modal open={isOpen} className={classes.modal} onClose={closeModal}>
      <Container className={classes.modalContainer}>
        <Grid container style={{ height: '100%', width: '100%', margin: 'auto' }}>
          <Grid item style={{ height: '100%', width: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography style={{ fontSize: '24px', fontWeight: '500', color: '#fff' }}>
                  Select Organization
                </Typography>
                <Box style={{ cursor: 'pointer' }} onClick={closeModal}>
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>
            <Paper
              style={{
                backgroundColor: '#FBFCFF',
                borderRadius: '0 0 8px 8px',
                width: '100%',
              }}
            >
              <FormControl component="fieldset" className={classes.formControl}>
                <Grid container className={classes.typeGroup}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Paper className={classes.modalPaperBody}>
                      <Grid item>
                        <Typography className={classes.selectTitle}>
                          Select Organization
                          <ModalTooltip
                            title="Organization"
                            handleTooltip={handleTooltip}
                            tooltipContent={<Typography color="inherit">TBD</Typography>}
                            openTooltip={openTooltip}
                            id="organization_name"
                          >
                            <HelpIcon
                              className={classes.helpIcon}
                              onClick={() => handleTooltip('organization_name')}
                            />
                          </ModalTooltip>
                        </Typography>
                        <Select
                          variant="outlined"
                          renderValue={(value) => {
                            const selectValue =
                              selectedOrg?.name ||
                              (value === 'Create New Organization' && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <img
                                    src={plusSignBlackIcon}
                                    className={classes.createNewOrgMenuItemIcon}
                                  />
                                  <span>{value}</span>
                                </div>
                              )) ||
                              'Select...';
                            return selectValue;
                          }}
                          displayEmpty
                          className={classes.orgSelect}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            classes: {
                              list: classes.dropDownMenu,
                            },
                            getContentAnchorEl: null,
                          }}
                          onChange={(e) => setSelectedOrg(e.target.value)}
                        >
                          <MenuItem
                            value="Create New Organization"
                            className={classes.createNewOrgMenuItem}
                          >
                            <img src={plusSignIcon} className={classes.createNewOrgMenuItemIcon} />
                            Create New Organization
                          </MenuItem>
                          {organizations?.map((organization) => (
                            <MenuItem key={organizations.name} value={organization}>
                              {organization.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid
                        item
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          type="submit"
                          className={classes.continueButton}
                          disabled={!selectedOrg}
                          onClick={() => {
                            if (selectedOrg === 'Create New Organization') {
                              setPage('create_new_org');
                              return;
                            }
                            setCurrentOrganization(selectedOrg);
                            closeModal();
                            history.push(`/new-build/${dealType}`);
                          }}
                        >
                          Continue
                        </Button>
                      </Grid>
                      <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography
                          className={classes.previousButton}
                          onClick={() => {
                            openNewBuildModal();
                            closeModal();
                          }}
                        >
                          Previous
                        </Typography>
                      </Grid>
                    </Paper>
                  </Box>
                </Grid>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

const CreateNewOrganization = ({
  isOpen,
  closeModal,
  setPage,
  classes,
  newOrganizationName,
  setNewOrganizationName,
  estimatedSPVQuantity,
  setEstimatedSPVQuanity,
  clearMasterEntityForm,
  createOrganization,
  openTooltip,
  handleTooltip,
}) => {
  return (
    <Modal
      open={isOpen}
      className={classes.modal}
      onClose={() => {
        setPage('select_org');
        closeModal();
      }}
    >
      <Container className={classes.modalContainer}>
        <Grid container style={{ height: '100%', width: '100%', margin: 'auto' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography style={{ fontSize: '24px', fontWeight: '500', color: '#fff' }}>
                  Create New Organization
                </Typography>
                <Box
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setPage('select_org');
                    closeModal();
                  }}
                >
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>
            <Paper
              style={{
                backgroundColor: '#FBFCFF',
                borderRadius: '0 0 8px 8px',
                width: '100%',
              }}
            >
              <FormControl
                component="fieldset"
                style={{
                  width: '100%',
                  height: '375px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid container className={classes.typeGroup}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Paper className={classes.modalPaperBody}>
                      <Grid item>
                        <Typography className={classes.formItemName}>
                          Organization Name
                          <ModalTooltip
                            title="Organization Name"
                            handleTooltip={handleTooltip}
                            tooltipContent={<Typography color="inherit">TBD</Typography>}
                            openTooltip={openTooltip}
                            id="organization_name"
                          >
                            <HelpIcon
                              className={classes.helpIcon}
                              onClick={() => handleTooltip('organization_name')}
                            />
                          </ModalTooltip>
                        </Typography>
                        <TextField
                          size="small"
                          value={newOrganizationName}
                          name="organization_name"
                          onChange={(e) => setNewOrganizationName(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '20px' }}>
                        <Typography className={classes.formItemName}>
                          Estimated number of SPVs in the next 12 months?
                          <ModalTooltip
                            title="SPV amount in the next 12 months"
                            handleTooltip={handleTooltip}
                            tooltipContent={
                              <Typography color="inherit">
                                Should you select 5 or more SPVs, you will be eligible for a High
                                Volume Partnership benefits (such as, custom name of your Master
                                Series LLC, custom name of your SPVs, and others)
                              </Typography>
                            }
                            openTooltip={openTooltip}
                            id="estimated_spv_quantity"
                          >
                            <HelpIcon
                              className={classes.helpIcon}
                              onClick={() => handleTooltip('estimated_spv_quantity')}
                            />
                          </ModalTooltip>
                        </Typography>
                        <TextField
                          size="small"
                          value={estimatedSPVQuantity}
                          name="estimated_spv_quantity"
                          onChange={(e) => {
                            setEstimatedSPVQuanity(e.target.value);
                            if (e.target.value < 5) {
                              clearMasterEntityForm();
                            }
                          }}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                      >
                        <Button
                          disabled={!newOrganizationName || !estimatedSPVQuantity}
                          variant="contained"
                          color="primary"
                          size="large"
                          type="submit"
                          className={classes.continueButton}
                          onClick={() => {
                            ///// IF 5 OR MORE SPVS SEND TO NEXT MODAL TO COLLECT MORE INFO ////
                            if (estimatedSPVQuantity >= 5) {
                              setPage('additional_info');
                              return;
                            }
                            /////// IF LESS THAN 5 ESTIMATED SPVS CREATE NEW ORG HERE RIGHT AWAY THEN PUSH TO BUILD PAGE ////
                            else createOrganization();
                          }}
                        >
                          Continue
                        </Button>
                      </Grid>
                      <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography
                          className={classes.previousButton}
                          onClick={() => setPage('select_org')}
                        >
                          Previous
                        </Typography>
                      </Grid>
                    </Paper>
                  </Box>
                </Grid>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

const AdditionalInformation = ({
  isOpen,
  closeModal,
  setPage,
  classes,
  createOrganization,
  masterEntityName,
  address,
  addressLineTwo,
  city,
  state,
  zipCode,
  country,
  setZipcode,
  setCountry,
  setState,
  setCity,
  setAddressLineTwo,
  setAddress,
  setMasterEntityName,
  openTooltip,
  handleTooltip,
}) => {
  const statesConstructor = states.UsaStates;
  const usStates = new statesConstructor();

  return (
    <Modal
      open={isOpen}
      className={classes.modal}
      onClose={() => {
        setPage('select_org');
        closeModal();
      }}
    >
      <Container className={classes.modalContainer}>
        <Grid container style={{ height: '100%', width: '100%', margin: 'auto' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography style={{ fontSize: '24px', fontWeight: '500', color: '#fff' }}>
                  Additional Information
                </Typography>
                <Box
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setPage('select_org');
                    closeModal();
                  }}
                >
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>
            <Paper
              style={{
                backgroundColor: '#FBFCFF',
                borderRadius: '0 0 8px 8px',
                width: '100%',
              }}
            >
              <FormControl
                component="fieldset"
                style={{
                  width: '100%',
                  height: '550px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid container className={classes.typeGroup}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Paper className={classes.modalPaperBody}>
                      <Grid item>
                        <Typography className={classes.formItemName}>
                          Master Entity Name
                          <ModalTooltip
                            title="Master Entity Name"
                            handleTooltip={handleTooltip}
                            tooltipContent={
                              <Typography color="inherit">Something Goes Here TBD</Typography>
                            }
                            openTooltip={openTooltip}
                            id="master_entity_name"
                          >
                            <HelpIcon
                              className={classes.helpIcon}
                              onClick={() => handleTooltip('master_entity_name')}
                            />
                          </ModalTooltip>
                        </Typography>
                        <TextField
                          size="small"
                          value={masterEntityName}
                          name="master_entity_name"
                          onChange={(e) => setMasterEntityName(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '20px' }}>
                        <Typography className={classes.formItemName}>
                          Address
                          <ModalTooltip
                            title="Address"
                            handleTooltip={handleTooltip}
                            tooltipContent={<Typography color="inherit">TBD</Typography>}
                            openTooltip={openTooltip}
                            id="address"
                          >
                            <HelpIcon
                              className={classes.helpIcon}
                              onClick={() => handleTooltip('address')}
                            />
                          </ModalTooltip>
                        </Typography>
                        <TextField
                          size="small"
                          value={address}
                          name="address"
                          placeholder="Address Line 1"
                          onChange={(e) => setAddress(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '20px' }}>
                        <TextField
                          size="small"
                          value={addressLineTwo}
                          placeholder="Address Line 2 (Optional)"
                          name="address_line_two"
                          onChange={(e) => setAddressLineTwo(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '20px' }}>
                        <TextField
                          size="small"
                          value={city}
                          placeholder="City"
                          name="city"
                          onChange={(e) => setCity(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}
                      >
                        <Select
                          variant="outlined"
                          className={classes.stateSelect}
                          renderValue={() => state || 'State'}
                          style={{ width: '250px', marginRight: '15px' }}
                          displayEmpty
                          onChange={(e) => setState(e.target.value)}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            classes: {
                              list: classes.dropDownMenu,
                            },
                            getContentAnchorEl: null,
                          }}
                        >
                          {usStates?.states?.map(({ name }) => (
                            <MenuItem value={name}>{name}</MenuItem>
                          ))}
                        </Select>
                        <TextField
                          size="small"
                          value={zipCode}
                          name="zipCode"
                          placeholder="Zip Code"
                          onChange={(e) => setZipcode(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '4px' }}>
                        <Select
                          fullWidth
                          variant="outlined"
                          renderValue={() => country}
                          displayEmpty
                          className={classes.countrySelect}
                          onChange={(e) => setCountry(e.target.value)}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            classes: {
                              list: classes.dropDownMenu,
                            },
                            getContentAnchorEl: null,
                          }}
                        >
                          {countries?.map(({ countryName }) => (
                            <MenuItem value={countryName}>{countryName}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid
                        item
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          type="submit"
                          className={classes.continueButton}
                          onClick={createOrganization}
                          disabled={
                            !masterEntityName || !address || !city || !state || !zipCode || !country
                          }
                        >
                          Continue
                        </Button>
                      </Grid>
                      <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography
                          className={classes.previousButton}
                          onClick={() => setPage('create_new_org')}
                        >
                          Previous
                        </Typography>
                      </Grid>
                    </Paper>
                  </Box>
                </Grid>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default function OrganizationModal(props) {
  const [page, setPage] = useState('select_org');

  const classes = useStyles({ page });
  const history = useHistory();
  const setCurrentOrganization = useSetCurrentOrganization();

  const [newOrganizationName, setNewOrganizationName] = useState('');
  const [estimatedSPVQuantity, setEstimatedSPVQuanity] = useState('');
  const [masterEntityName, setMasterEntityName] = useState('');
  const [address, setAddress] = useState('');
  const [addressLineTwo, setAddressLineTwo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipcode] = useState('');
  const [country, setCountry] = useState('United States');

  const clearMasterEntityForm = () => {
    setMasterEntityName('');
    setAddress('');
    setAddressLineTwo('');
    setCity('');
    setState('');
    setZipcode('');
    setCountry('United States');
  };

  const clearAllFields = () => {
    setNewOrganizationName('');
    setEstimatedSPVQuanity('');
    clearMasterEntityForm();
  };

  const resetFlow = () => {
    clearAllFields();
    setPage('select_org');
  };

  const [createOrganization, { data, loading, error }] = useMutation(CREATE_ORG, {
    variables: {
      organization: {
        name: newOrganizationName,
        // slug: newOrganizationName.split(' ').join('-'),
        masterEntity: {
          name: masterEntityName || 'Atomizer LLC',
          address: address || '8 The Green',
          addressLineTwo: masterEntityName ? addressLineTwo : 'Suite A',
          city: city || 'Dover',
          state: state || 'Delaware',
          zipCode: zipCode || '19901',
          country: country || 'United States',
        },
      },
    },
    onCompleted: ({ createOrganization }) => {
      if (createOrganization?.name) {
        console.log('DATA IT WORKED', createOrganization);
        setCurrentOrganization(createOrganization);
        resetFlow();
        props.closeModal();
      }
      // history.push(`/new-build/${dealType}`)
    },
    onError: (err) => console.log('GRAPHQL ERRORRRR', err),
  });

  const [openTooltip, setOpenTooltip] = useState('');

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  const pageMap = {
    select_org: SelectOrganization,
    create_new_org: CreateNewOrganization,
    additional_info: AdditionalInformation,
  };

  const propsObj = {
    newOrganizationName,
    estimatedSPVQuantity,
    masterEntityName,
    address,
    addressLineTwo,
    city,
    state,
    zipCode,
    country,
    createOrganization,
    setZipcode,
    setCountry,
    setState,
    setCity,
    setAddressLineTwo,
    setAddress,
    setMasterEntityName,
    setNewOrganizationName,
    setEstimatedSPVQuanity,
    setPage,
    clearMasterEntityForm,
    setCurrentOrganization,
    classes,
    handleTooltip,
    openTooltip,
    history,
    ...props,
  };

  const Component = pageMap[page];

  return <Component {...propsObj} />;
}
