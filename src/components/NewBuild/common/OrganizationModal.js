import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../../../auth/useAuth';
import { useHistory } from 'react-router';
import { useSetCurrentOrganization } from '../../../state/current-organization';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: '72px',
    width: '72px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0px 0px 15px 0px',
    borderRadius: '48px',
    padding: '12px',
    backgroundColor: '#ECF3FF',
  },
  helpIcon: {
    marginLeft: '0.2em',
    cursor: 'pointer',
    color: '#205DF5',
    fontSize: '15px',
  },
  warningIcon: {
    height: '72px',
    width: '72px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0px 0px 15px 0px',
    borderRadius: '48px',
    padding: '12px',
    backgroundColor: '#F2CECC',
  },
  formItemName: {
    alignSelf: 'flex-start',
    color: '#2A2B54',
    font: 'normal normal bold 17px/20px Roboto',
    marginBottom: '10px',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginLeft: '8px',
    },
  },
  inputBox: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    borderRadius: '30px !important',
    padding: '0',
    maxWidth: '568px',
    width: '100%',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaperBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    margin: '.5rem',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: 'none !important',
    cursor: 'pointer',
    border: 'solid #E5E5E5 1px',
    '&:hover': {
      boxShadow: '0px 5px 10px 2px rgba(225, 225, 225, .8) !important',
    },
  },
  modalPaperTitle: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: '18px 29px',
    maxHeight: 'calc(100% - 8vh)',
    borderBottom: 'solid #E5E5E5 1px',
  },

  label: {
    color: '#2A2B54',
    fontWeight: 'bold',
  },
  typeBadge: {
    backgroundColor: '#ECF3FF',
    color: '#0461FF',
    fontSize: '13px',
    lineHeight: '16.41px',
    borderRadius: '4px',
    padding: '5px 10px',
  },
  cancelButton: {
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
  orgSelect: {
    width: '100%',
    borderRadius: '10px !important',
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
  typeBody: {
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '400',
    marginTop: '16px',
  },
  typeGrid: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: '5px 0px 25px 0px',
  },
  typeGroup: {
    width: '92.5%',
    margin: '20px',
    flexDirection: 'row',
  },
  selectTitle: {
    alignSelf: 'flex-start',
    marginBottom: '10px',
    color: '#000',
    fontSize: '18px',
    fontWeight: '500',
  },
  dropDownMenu: {
    height: '225px',
    overflowY: 'scroll',
  },
}));

const SelectOrganization = ({
  isOpen,
  closeModal,
  setPage,
  classes,
  dealType,
  history,
  openNewBuildModal,
}) => {
  const { loading: userLoading, userProfile } = useAuth();
  const setCurrentOrganization = useSetCurrentOrganization();
  const [organizations, setOrganizations] = useState(userProfile?.organizations_admin || []);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    if (!organizations?.length) setOrganizations(userProfile?.organizations_admin);
  }, [userLoading]);

  return (
    <Modal open={isOpen} className={classes.modal} onClose={closeModal}>
      <Container style={{ width: '650px' }}>
        <Grid container style={{ height: '100%', width: '90%', margin: 'auto' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
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
                borderRadius: '0 0 1rem 1rem',
                width: '100%',
              }}
            >
              <FormControl
                component="fieldset"
                style={{
                  width: '100%',
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
                      <Grid
                        item
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          margin: '10px 10px 10px 5px',
                        }}
                      >
                        <Typography className={classes.selectTitle}>Select Organization</Typography>
                        <Select
                          variant="outlined"
                          // displayEmpty
                          renderValue={(value) => {
                            const selectValue =
                              selectedOrg?.name ||
                              (value === 'Create New Organization' && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <img
                                    src={plusSignIcon}
                                    className={classes.createNewOrgMenuItemIcon}
                                  />
                                  <span className={classes.createNewOrgMenuItem}>{value}</span>
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
                      <Grid item className={classes.typeGrid}></Grid>
                      <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          type="submit"
                          style={{
                            width: '70%',
                            borderRadius: '8px',
                            backgroundColor: '#186EFF',
                          }}
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
                          className={classes.cancelButton}
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
      <Container style={{ width: '650px' }}>
        <Grid container style={{ height: '100%', width: '90%', margin: 'auto' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
                  Create New Organization
                </Typography>
                <Box style={{ cursor: 'pointer' }} onClick={closeModal}>
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>
            <Paper
              style={{
                backgroundColor: '#FBFCFF',
                borderRadius: '0 0 1rem 1rem',
                width: '100%',
              }}
            >
              <FormControl
                component="fieldset"
                style={{
                  width: '100%',
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
                        <Typography className={classes.formItemName}>Organization Name</Typography>
                        <TextField
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
                          value={estimatedSPVQuantity}
                          name="estimated_spv_quantity"
                          onChange={(e) => setEstimatedSPVQuanity(e.target.value)}
                          className={classes.inputBox}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          type="submit"
                          style={{
                            width: '70%',
                            borderRadius: '8px',
                            backgroundColor: '#186EFF',
                          }}
                          onClick={() => {
                            /////// IF LESS THAN 5 ESTIMATED SPVS CREATE NEW ORG HERE RIGHT AWAY THEN PUSH TO BUILD PAGE ////
                            ///// IF 5 OR MORE SPVS SEND TO NEXT MODAL TO COLLECT MORE INFO ////
                          }}
                        >
                          Continue
                        </Button>
                      </Grid>
                      <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography
                          className={classes.cancelButton}
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

export default function OrganizationModal(props) {
  const classes = useStyles();
  const history = useHistory();

  const [page, setPage] = useState('select_org');
  const [newOrganizationName, setNewOrganizationName] = useState('');
  const [estimatedSPVQuantity, setEstimatedSPVQuanity] = useState('');
  const [openTooltip, setOpenTooltip] = useState('');

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  const pageMap = {
    select_org: SelectOrganization,
    create_new_org: CreateNewOrganization,
  };

  const propsObj = {
    ...props,
    newOrganizationName,
    estimatedSPVQuantity,
    openTooltip,
    handleTooltip,
    setPage,
    setNewOrganizationName,
    setEstimatedSPVQuanity,
    classes,
    history,
  };

  const Component = pageMap[page];

  return <Component {...propsObj} />;
}
