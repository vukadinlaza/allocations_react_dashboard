import React, { useState, useEffect } from 'react';
import { useSimpleReducer } from '../../utils/hooks';
import _, { get, isEqual } from 'lodash';
import { useParams, Link, useHistory } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// wysiwyg editor
import { Editor } from '@tinymce/tinymce-react';

import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Grid,
  Divider,
  IconButton,
} from '@material-ui/core';

import './style.scss';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { useAuth } from '../../auth/useAuth';
import { ORG_OVERVIEW } from '../admin/AdminHome';
import InviteInvestors from './InviteInvestors';
import UserSearch from '../forms/UserSearch';
import * as API from '../../api';
import { nWithCommas, formatDate } from '../../utils/numbers';
import Loader from '../utils/Loader';

/** *
 *
 * DealEdit is where a fund manager or superadmin can edit a deal, this includes
 *  1) change parameters like name, round size etc...
 *  2) add deal documents for data room
 *  3) invite investors to a deal
 *  4) update investments in the deal
 *  5) delete the deal (if superadmin)
 *
 * */

const GET_DEAL = gql`
  query Deal($id: String!, $slug: String!) {
    organization(slug: $slug) {
      _id
      deal(_id: $id) {
        _id
        slug
        company_name
        company_description
        date_closed
        deal_lead
        pledge_link
        onboarding_link
        allInvited
        status
        inviteKey
        target
        amount_raised
        memo
        last_valuation
        no_exchange
        appLink
        publicLink
        docSpringTemplateId
        documents {
          path
          link
        }
        investments {
          _id
          status
          amount
          investor {
            _id
            name
          }
        }
        invitedInvestors {
          _id
          name
          email
        }
        emailInvites {
          status
          sent_at
          to
          opened
          opened_at
        }
        dealParams {
          risks
          coinvestors
          totalRoundSize
          dealType
          dealMultiple
          allocation
          totalCarry
          minimumInvestment
          signDeadline
          wireDeadline
          estimatedSetupCosts
          estimatedSetupCostsDollar
          estimatedTerm
          managementFees
          managementFeesDollar
          managementFeeType
          portfolioTotalCarry
          portfolioEstimatedSetupCosts
          portfolioEstimatedSetupCostsDollar
          portfolioManagementFees
          portfolioManagementFeesDollar
          portfolioManagementFeeType
          fundTotalCarry
          fundEstimatedSetupCosts
          fundEstimatedSetupCostsDollar
          fundManagementFees
          fundManagementFeesDollar
          fundManagementFeeType
          fundGeneralPartner
          fundEstimatedTerm
        }
      }
    }
  }
`;

const UPDATE_DEAL = gql`
  mutation UpdateDeal($org: String!, $deal: DealInput!) {
    updateDeal(org: $org, deal: $deal) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      status
      allInvited
      inviteKey
      memo
      target
      amount_raised
      docSpringTemplateId
      invitedInvestors {
        _id
        name
      }
      dealParams {
        risks
        totalRoundSize
        dealType
        dealMultiple
        allocation
        totalCarry
        minimumInvestment
        signDeadline
        wireDeadline
        estimatedSetupCosts
        estimatedSetupCostsDollar
        estimatedTerm
        managementFees
        managementFeesDollar
        managementFeeType
        portfolioTotalCarry
        portfolioEstimatedSetupCosts
        portfolioEstimatedSetupCostsDollar
        portfolioManagementFees
        portfolioManagementFeesDollar
        portfolioManagementFeeType
        fundTotalCarry
        fundEstimatedSetupCosts
        fundEstimatedSetupCostsDollar
        fundManagementFees
        fundManagementFeesDollar
        fundManagementFeeType
        fundGeneralPartner
        fundEstimatedTerm
      }
    }
  }
`;

const validInputs = [
  '_id',
  'company_name',
  'company_description',
  'date_closed',
  'deal_lead',
  'pledge_link',
  'onboarding_link',
  'embed_code',
  'status',
  'closed',
  'allInvited',
  'amount',
  'memo',
  'target',
  'amount_raised',
  'no_exchange',
  'last_valuation',
  'dealParams',
  'Annual',
  'One-Time',
  'docSpringTemplateId',
];

const dealParamsValidInputs = [
  'allocation',
  'dealType',
  'dealMultiple',
  'totalCarry',
  'keyHighlights',
  'risks',
  'minimumInvestment',
  'maximumInvestment',
  'totalManagementFee',
  'totalRoundSize',
  'signDeadline',
  'wireDeadline',
  'estimatedSetupCosts',
  'estimatedSetupCostsDollar',
  'estimatedTerm',
  'managementFees',
  'managementFeesDollar',
  'managementFeeType',
  'portfolioTotalCarry',
  'portfolioEstimatedSetupCosts',
  'portfolioEstimatedSetupCostsDollar',
  'portfolioManagementFees',
  'portfolioManagementFeeType',
  'portfolioManagementFeesDollar',
  'fundTotalCarry',
  'fundEstimatedSetupCosts',
  'fundEstimatedSetupCostsDollar',
  'fundManagementFees',
  'fundManagementFeesDollar',
  'fundManagementFeeType',
  'fundGeneralPartner',
  'fundEstimatedTerm',
  'coinvestors',
  'dealLogo',
];


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  divider: {
    margin: '16px -16px',
  },
  h5: {
    color: '#3A506B',
  },
  table: {
    width: 'calc(100% + 32px)',
    margin: '16px -16px',
  },
}));

export default function DealEdit() {
  const history = useHistory();
  const classes = useStyles();
  const { userProfile } = useAuth();
  const { id, organization } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [deal, setDeal] = useSimpleReducer({
    dealParams: {},
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { data, refetch, error, loading } = useQuery(GET_DEAL, { variables: { id, slug: organization } });
  const [updateDeal] = useMutation(UPDATE_DEAL);

  const [currentEditTab, setEditTab] = useState(0);
  const handleEditTabChange = (event, newValue) => {
    setEditTab(newValue);
  };

  useEffect(() => {
    if (data) {
      if (data?.organization?.deal) {
        setDeal(data.organization.deal);
      } else {
        setErrorMessage('Not Authorized to View this Deal');
      }
    }
  }, [data, setDeal]);

  useEffect(() => {
    setHasChanges(data && !isEqual(deal, get(data, 'organization.deal')));
  }, [data, deal]);

  if (errorMessage) return <div className="Error">{errorMessage}</div>;


  return (
    <div className="DealEdit">
      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h5" className={classes.h5}>
              <strong>Edit Deal</strong>
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            <Button onClick={() => history.push(deal.appLink || '#')} variant="contained" color="primary">
              view
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ margin: '16px 0' }} />
            <Typography variant="body2" gutterBottom>
              <strong>Data Room</strong>
            </Typography>
            {!loading ? (
              <Editor
                value={deal.memo}
                apiKey="jlbrhzgo0m2myqdmbhaav8a0971vomza2smty20fpq6fs47j"
                init={{
                  height: 350,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
                }}
                onEditorChange={(value) => {
                  setDeal({
                    memo: value,
                    dealParams: {
                      ...deal.dealParams,
                    },
                  });
                }}
              />
            ) : (
              <Loader />
            )}

            <Grid container spacing={2} style={{ marginTop: 16 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.company_name || ''}
                  onChange={(e) => setDeal({ company_name: e.target.value })}
                  label="Company Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.company_description || ''}
                  onChange={(e) => setDeal({ company_description: e.target.value })}
                  label="Company Description"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.wireDeadline || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, wireDeadline: e.target.value } })}
                  label="Closing Date"
                  type="datetime-local"
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" style={{ width: '100%' }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={deal.status || ''}
                    onChange={(e) => setDeal({ status: e.target.value })}
                    inputProps={{ name: 'Type' }}
                  >
                    <MenuItem value="onboarding">Onboarding</MenuItem>
                    <MenuItem value="closing">Closing</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" style={{ width: '100%' }}>
                  <InputLabel>All Invited</InputLabel>
                  <Select
                    value={deal.allInvited || 'false'}
                    onChange={(e) => setDeal({ allInvited: e.target.value === 'false' })}
                    inputProps={{ name: 'Type' }}
                  >
                    <MenuItem value="false">False</MenuItem>
                    {/* <MenuItem value="true">True</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.target || ''}
                  onChange={(e) => setDeal({ target: e.target.value })}
                  label="Target Raise"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.amount_raised || ''}
                  onChange={(e) => setDeal({ amount_raised: e.target.value })}
                  label="Amount Raised"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.totalRoundSize || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, totalRoundSize: e.target.value } })}
                  label="Total Round Size"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.allocation || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, allocation: e.target.value } })}
                  label="Allocation"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.pledge_link || ''}
                  onChange={(e) => setDeal({ pledge_link: e.target.value })}
                  label="Pledge Link"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.minimumInvestment || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        minimumInvestment: e.target.value,
                      },
                    })
                  }
                  label="Minimum Investment ($)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.onboarding_link || ''}
                  onChange={(e) => setDeal({ onboarding_link: e.target.value })}
                  label="Onboarding Link"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.dealMultiple || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, dealMultiple: e.target.value } })}
                  label="Deal Multiple"
                  inputProps={{
                    startAdornment: <InputAdornment position="start" />,
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.dealType || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, dealType: e.target.value } })}
                  label="Deal Type (506c)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start" />,
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Deadlines</strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.signDeadline || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, signDeadline: e.target.value } })}
                  label="Signing Deadline"
                  type="datetime-local"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.wireDeadline || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, wireDeadline: e.target.value } })}
                  label="Wiring Deadline"
                  type="datetime-local"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong> Doc Spring Template ID</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.docSpringTemplateId || ''}
                  onChange={(e) => setDeal({ docSpringTemplateId: e.target.value })}
                  label="DocSpring Template ID"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong> SPV Terms</strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.managementFees || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, managementFees: e.target.value } })}
                  label="Management Fee (%)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.managementFeesDollar || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        managementFeesDollar: e.target.value,
                      },
                    })
                  }
                  label="Management Fee ($)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" style={{ width: '100%' }}>
                  <InputLabel>Fee Type</InputLabel>
                  <Select
                    value={deal.dealParams.managementFeeType || ''}
                    onChange={(e) =>
                      setDeal({
                        dealParams: {
                          ...deal.dealParams,
                          managementFeeType: e.target.value,
                        },
                      })
                    }
                    inputProps={{ name: 'Type' }}
                  >
                    <MenuItem value="Annual">Annual</MenuItem>
                    <MenuItem value="One-Time">One-Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.estimatedSetupCosts || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        estimatedSetupCosts: e.target.value,
                      },
                    })
                  }
                  label="Estimated Setup Cost (%)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.estimatedSetupCostsDollar || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        estimatedSetupCostsDollar: e.target.value,
                      },
                    })
                  }
                  label="Estimated Setup Cost ($)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.totalCarry || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, totalCarry: e.target.value } })}
                  label="Total Carry (%)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.deal_lead || ''}
                  onChange={(e) => setDeal({ deal_lead: e.target.value })}
                  label="Organizer"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.estimatedTerm || ''}
                  onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, estimatedTerm: e.target.value } })}
                  label="Estimated Term"
                  inputProps={{
                    startAdornment: <InputAdornment position="start" />,
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Portfolio Company Terms</strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.portfolioTotalCarry || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        portfolioTotalCarry: e.target.value,
                      },
                    })
                  }
                  label="Portfolio Total Carry (%)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.portfolioManagementFees || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        portfolioManagementFees: e.target.value,
                      },
                    })
                  }
                  label="Portfolio Management Fee (%)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.portfolioManagementFeesDollar || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        portfolioManagementFeesDollar: e.target.value,
                      },
                    })
                  }
                  label="Portfolio Management Fee ($)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" style={{ width: '100%' }}>
                  <InputLabel>Fee Type</InputLabel>
                  <Select
                    value={deal.dealParams.portfolioManagementFeeType || ''}
                    onChange={(e) =>
                      setDeal({
                        dealParams: {
                          ...deal.dealParams,
                          portfolioManagementFeeType: e.target.value,
                        },
                      })
                    }
                    inputProps={{ name: 'Type' }}
                  >
                    <MenuItem value="Annual">Annual</MenuItem>
                    <MenuItem value="One-Time">One-Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.portfolioEstimatedSetupCosts || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        portfolioEstimatedSetupCosts: e.target.value,
                      },
                    })
                  }
                  label="Portfolio Estimated Setup Cost (%)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  value={deal.dealParams.portfolioEstimatedSetupCostsDollar || ''}
                  onChange={(e) =>
                    setDeal({
                      dealParams: {
                        ...deal.dealParams,
                        portfolioEstimatedSetupCostsDollar: e.target.value,
                      },
                    })
                  }
                  label="Portfolio Estimated Setup Cost ($)"
                  inputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              <strong>Fund Terms</strong>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundGeneralPartner || ''}
              onChange={(e) =>
                setDeal({
                  dealParams: {
                    ...deal.dealParams,
                    fundGeneralPartner: e.target.value,
                  },
                })
              }
              label="General Partner"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundTotalCarry || ''}
              onChange={(e) => setDeal({ dealParams: { ...deal.dealParams, fundTotalCarry: e.target.value } })}
              label="Total Carry (%)"
              inputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundManagementFees || ''}
              onChange={(e) =>
                setDeal({
                  dealParams: {
                    ...deal.dealParams,
                    fundManagementFees: e.target.value,
                  },
                })
              }
              label="Management Fee (%)"
              inputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundManagementFeesDollar || ''}
              onChange={(e) =>
                setDeal({
                  dealParams: {
                    ...deal.dealParams,
                    fundManagementFeesDollar: e.target.value,
                  },
                })
              }
              label="Management Fee ($)"
              inputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" style={{ width: '100%' }}>
              <InputLabel>Fee Type</InputLabel>
              <Select
                value={deal.dealParams.fundManagementFeeType || ''}
                onChange={(e) =>
                  setDeal({
                    dealParams: {
                      ...deal.dealParams,
                      fundManagementFeeType: e.target.value,
                    },
                  })
                }
                inputProps={{ name: 'Type' }}
              >
                <MenuItem value="Annual">Annual</MenuItem>
                <MenuItem value="One-Time">One-Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundEstimatedSetupCosts || ''}
              onChange={(e) =>
                setDeal({
                  dealParams: {
                    ...deal.dealParams,
                    fundEstimatedSetupCosts: e.target.value,
                  },
                })
              }
              label="Estimated Setup Cost (%)"
              inputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundEstimatedSetupCostsDollar || ''}
              onChange={(e) =>
                setDeal({
                  dealParams: {
                    ...deal.dealParams,
                    fundEstimatedSetupCostsDollar: e.target.value,
                  },
                })
              }
              label="Estimated Setup Cost ($)"
              inputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.dealParams.fundEstimatedTerm || ''}
              onChange={(e) =>
                setDeal({
                  dealParams: {
                    ...deal.dealParams,
                    fundEstimatedTerm: e.target.value,
                  },
                })
              }
              label="Estimated Term"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AddCoInvestor deal={deal} setDeal={setDeal} />
            <AddRisk deal={deal} setDeal={setDeal} />
            <AddDealLogo deal={deal} refetch={refetch} />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={!hasChanges}
              style={{ marginTop: 16 }}
              variant="contained"
              onClick={() => {
                updateDeal({
                  variables: {
                    deal: {
                      ..._.pick(deal, validInputs),
                      dealParams: _.pick(deal.dealParams, dealParamsValidInputs),
                    },
                    org: organization,
                  },
                });
              }}
              color="primary"
            >
              Update Deal
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              <strong>Invites</strong>
            </Typography>
            <InviteInvestors deal={deal} refetch={refetch} />
          </Grid>

          <Grid item xs={10}>
            <Typography variant="body2">
              <strong>Exchange Data</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" style={{ width: '100%' }}>
              <InputLabel>Exchange Options</InputLabel>
              <Select
                value={deal.no_exchange || false}
                onChange={(e) => setDeal({ no_exchange: e.target.value === 'true' })}
                inputProps={{ name: 'Type' }}
              >
                <MenuItem value="false">Exchange Allowed</MenuItem>
                <MenuItem value="true">Do Not Allow Exchange</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ width: '100%' }}
              value={deal.last_valuation || ''}
              onChange={(e) => setDeal({ last_valuation: e.target.value })}
              label="Last Valuation"
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon="dollar-sign" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item sm={12}>
            <Grid container spacing={2}>
              <DataRoom refetch={refetch} deal={deal} />
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  style={{ width: '100%' }}
                  label="Deal ID"
                  value={deal._id || ''}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FontAwesomeIcon
                          icon="copy"
                          onClick={() => navigator.clipboard.writeText(window.origin + (deal.publicLink || ''))}
                        />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: '100%' }}
                  label="Existing user link"
                  value={window.origin + (deal.appLink || '')}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FontAwesomeIcon
                          icon="copy"
                          onClick={() => navigator.clipboard.writeText(window.origin + (deal.appLink || ''))}
                        />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={!hasChanges}
              variant="contained"
              onClick={() => {
                updateDeal({
                  variables: {
                    deal: {
                      ..._.pick(deal, validInputs),
                      dealParams: _.pick(deal.dealParams, dealParamsValidInputs),
                    },
                    org: organization,
                  },
                });
              }}
              color="primary"
            >
              Update Deal
            </Button>

            {userProfile.admin && (
              <Grid item xs={12}>
                <Divider style={{ margin: '16px 0' }} />
                <DeleteDeal deal={deal} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

const ADD_DOC = gql`
  mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
    addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
      _id
    }
  }
`;

function DataRoom({ deal, refetch }) {
  const [doc, setDoc] = useSimpleReducer({ title: '' });
  const [addDoc, { data, error }] = useMutation(ADD_DOC);

  useEffect(() => {
    if (data) {
      refetch();
      setDoc({ title: '', doc: null });
    }
  }, [data, refetch, setDoc]);

  const submit = () => {
    if (doc.doc && doc.title) {
      addDoc({ variables: { deal_id: deal._id, ...doc } });
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2">Wire Instructions</Typography>
      </Grid>

      <Grid item xs={12} sm={3}>
        {doc.doc && (
          <span>
            <FontAwesomeIcon icon="link" /> {doc.doc.name}
          </span>
        )}
        {!doc.doc && (
          <Button fullWidth variant="contained" component="label" style={{ height: 39 }}>
            Attach
            <input
              type="file"
              style={{ display: 'none' }}
              accept="application/pdf"
              onChange={({ target }) => {
                if (target.validity.valid) setDoc({ doc: target.files[0] });
              }}
            />
          </Button>
        )}
      </Grid>

      <Grid item xs={12} sm={5}>
        <TextField
          required
          margin="dense"
          size="small"
          variant="outlined"
          style={{ marginTop: 0 }}
          label="Title"
          fullWidth
          value={doc.title}
          onChange={(e) => setDoc({ title: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <Button variant="contained" onClick={submit} style={{ height: 39 }} fullWidth color="primary">
          Upload to Data Room
        </Button>
      </Grid>

      <Grid item xs={12} sm={6}>
        {(deal.documents || []).map((doc) => (
          <Doc key={doc.path} doc={doc} deal={deal} refetch={refetch} />
        ))}
      </Grid>

      <Grid item xs={12}>
        <Divider style={{ marginBottom: 16 }} />
      </Grid>
    </>
  );
}

const RM_DOC = gql`
  mutation RmDoc($deal_id: String!, $title: String!) {
    rmDealDoc(deal_id: $deal_id, title: $title) {
      _id
    }
  }
`;

function Doc({ doc, deal, refetch }) {
  const [rmDoc, { data, error }] = useMutation(RM_DOC);

  useEffect(() => {
    if (data) refetch();
  }, [data, refetch]);

  const submit = () => {
    if (window.confirm(`Delete ${doc.path} document?`)) {
      rmDoc({ variables: { deal_id: deal._id, title: doc.path } });
    }
  };

  return (
    <span>
      <a href={`https://${doc.link}`} target="_blank">
        <FontAwesomeIcon icon="link" /> &nbsp;{doc.path} &nbsp;&nbsp;
      </a>
      <FontAwesomeIcon icon="times" onClick={submit} />
    </span>
  );
}

const UPDATE_INVESTMENT = gql`
  mutation UpdateInvestment($investment: InvestmentInput!) {
    updateInvestment(investment: $investment) {
      _id
      status
      amount
      investor {
        _id
        name
      }
    }
  }
`;

function Investment({ investment: i, refetch }) {
  const [editing, setEditing] = useState(false);
  const [changes, setChanges] = useSimpleReducer({});
  const [updateInvestment] = useMutation(UPDATE_INVESTMENT);

  const update = () => {
    updateInvestment({
      variables: { investment: { _id: i._id, ...changes } },
    });
  };

  if (editing) {
    return (
      <TableRow>
        <TableCell colSpan={4}>
          <Paper>
            <div>
              {get(i, 'investor.name')}
              <FontAwesomeIcon icon="times" onClick={() => setEditing(false)} />
            </div>

            <TextField
              value={changes.amount || i.amount || ''}
              onChange={(e) => setChanges({ amount: Number(e.target.value) })}
              label="Amount"
              variant="outlined"
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <FormControl variant="outlined" style={{ width: '100%', marginBottom: '10px' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={changes.status || i.status || ''}
                onChange={(e) => setChanges({ status: e.target.value })}
                inputProps={{ name: 'Type' }}
              >
                <MenuItem value="invited">Invited</MenuItem>
                <MenuItem value="pledged">Pledged</MenuItem>
                <MenuItem value="onboarded">Onboarded</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
            <div>
              <Button variant="contained" onClick={update} color="primary">
                UPDATE
              </Button>
            </div>
          </Paper>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="invited-inv">
      <TableCell>{get(i, 'investor.name')}</TableCell>
      <TableCell>{i.amount ? `$${nWithCommas(i.amount)}` : 'TBD'}</TableCell>
      <TableCell>
        <span className={`investment-status investment-status-${i.status}`}>{i.status}</span>
      </TableCell>
      <TableCell>
        <IconButton onClick={() => setEditing(true)}>
          <EditIcon />
        </IconButton>
        <DeleteInvestment investment={i} refetch={refetch} />
      </TableCell>
    </TableRow>
  );
}

function DeleteInvestment({ investment, refetch }) {
  const [delInvestment, { data }] = useMutation(API.investments.destroy);

  useEffect(() => {
    if (data && data.deleteInvestment) refetch();
  }, [data, refetch]);

  const submit = () => {
    if (window.confirm('Delete Investment?')) delInvestment({ variables: { id: investment._id } });
  };

  return (
    <IconButton onClick={submit}>
      <CloseIcon />
    </IconButton>
  );
}

function validate(investment) {
  return _.reject(['deal_id', 'user_id', 'amount', 'status'], (prop) => investment[prop]);
}

function AddInvestment({ deal, show, refetch }) {
  const [investment, setInvestment] = useSimpleReducer({ amount: '', status: 'complete' });
  const [createInvestment, { data }] = useMutation(API.investments.create);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (deal && !investment.deal_id) {
      setInvestment({ deal_id: deal._id });
    }
  }, [deal, investment.deal_id, setInvestment]);

  useEffect(() => {
    if (user) setInvestment({ user_id: user._id });
  }, [setInvestment, user]);

  useEffect(() => {
    if (data) {
      setInvestment({ deal_id: deal._id, amount: '', user_id: user._id });
      refetch();
    }
  }, [data, deal._id, refetch, setInvestment, user._id]);

  const submit = () => {
    const validation = validate(investment);
    setErrors(validation);
    if (validation.length === 0) createInvestment({ variables: { investment } });
  };

  if (!show) return null;

  return (
    <>
      <UserSearch user={user} setUser={setUser} errors={errors} />
      <div style={{ margin: '16px 0' }}>
        <TextField
          required
          error={errors.includes('amount')}
          style={{ width: '100%' }}
          value={investment.amount}
          onChange={(e) => setInvestment({ amount: Math.floor(e.target.value) })}
          label="Amount"
          variant="outlined"
        />
      </div>
      <div>
        <FormControl variant="outlined" style={{ width: '100%', marginBottom: '10px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={investment.status || ''}
            onChange={(e) => setInvestment({ status: e.target.value })}
            inputProps={{ name: 'Type' }}
          >
            <MenuItem value="invited">Invited</MenuItem>
            <MenuItem value="pledged">Pledged</MenuItem>
            <MenuItem value="onboarded">Onboarded</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button variant="contained" onClick={submit} style={{ backgroundColor: '#f7bf47' }} color="primary">
        ADD INVESTMENT
      </Button>
    </>
  );
}

const DELETE_DEAL = gql`
  mutation DeleteDeal($_id: String!) {
    deleteDeal(_id: $_id)
  }
`;

function DeleteDeal({ deal }) {
  const { organization } = useParams();
  const history = useHistory();
  const [deleteDeal, { data, error }] = useMutation(DELETE_DEAL, {
    variables: { _id: deal._id },
    refetchQueries: [{ query: ORG_OVERVIEW, variables: { slug: organization } }],
    onCompleted: () => history.push(`/admin/${organization}`),
  });

  const submit = () => {
    if (window.confirm(`Are you sure you'd like to delete ${deal.company_name}`)) {
      deleteDeal();
    }
  };

  return (
    <Button onClick={submit} variant="default" style={{ color: 'red' }}>
      Delete Deal
    </Button>
  );
}

const AddCoInvestor = ({ deal, setDeal }) => {
  const [coinvestor, setCoinvestor] = useState('');
  const addCoInvestor = () => {
    setDeal({
      ...deal,
      dealParams: { ...deal.dealParams, coinvestors: [...(deal?.dealParams?.coinvestors || []), coinvestor] },
    });
    setCoinvestor('');
  };
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2">
          <strong>CoInvestors</strong>
        </Typography>
      </Grid>

      <TextField
        style={{ width: '100%' }}
        value={coinvestor || ''}
        onChange={(e) => setCoinvestor(e.target.value)}
        label="CoInvestor"
        type="text"
        variant="outlined"
      />
      <Button onClick={() => addCoInvestor()}> Add</Button>

      <List dense>
        {(deal?.dealParams?.coinvestors || []).map((i) => {
          return (
            <ListItem>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText primary={i} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
const AddRisk = ({ deal, setDeal }) => {
  const [risk, setrisk] = useState('');
  const addrisk = () => {
    setDeal({
      ...deal,
      dealParams: { ...deal.dealParams, risks: [...(deal?.dealParams?.risks || []), risk] },
    });
    setrisk('');
  };
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2">
          <strong>Risks</strong>
        </Typography>
      </Grid>
      <TextField
        style={{ width: '100%' }}
        value={risk || ''}
        onChange={(e) => setrisk(e.target.value)}
        label="risk"
        type="text"
        variant="outlined"
      />
      <Button onClick={() => addrisk()}> Add</Button>

      <List dense>
        {(deal?.dealParams?.risks || []).map((i) => {
          return (
            <ListItem>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText primary={i} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
function AddDealLogo({ deal, refetch }) {
  const [doc, setDoc] = useSimpleReducer({ title: 'DealLogo' });
  const [addDoc, { data, error }] = useMutation(ADD_DOC);

  useEffect(() => {
    if (data) {
      refetch();
      setDoc({ title: '', doc: null });
    }
  }, [data, refetch, setDoc]);

  const submit = () => {
    if (doc.doc && doc.title) {
      addDoc({ variables: { deal_id: deal._id, ...doc } });
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2">Deal Logo</Typography>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Button fullWidth variant="contained" component="label" style={{ height: 39 }}>
          Attach
          <input
            type="file"
            style={{ display: 'none' }}
            accept="application/pdf"
            onChange={({ target }) => {
              if (target.validity.valid) setDoc({ doc: target.files[0] });
            }}
          />
        </Button>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Button variant="contained" onClick={submit} style={{ height: 39 }} fullWidth color="primary">
          Upload Logo
        </Button>
      </Grid>

      <Grid item xs={12} sm={6}>
        <img src={deal.dealParams.dealLogo} />
      </Grid>

      <Grid item xs={12}>
        <Divider style={{ marginBottom: 16 }} />
      </Grid>
    </>
  );
}
