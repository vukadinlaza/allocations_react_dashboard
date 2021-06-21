import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { gql } from 'apollo-boost';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import {
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Grid,
  TableHead,
  Typography,
  TextField,
} from '@material-ui/core';
import FormModal from '../../Modal';
import { nWithCommas, formatDate } from '../../../utils/numbers';
import { Deal } from '../../admin/AdminHome/components/active-deals';
import EditOrg from '../../forms/editOrg';
import EditInvestor from '../../forms/editInvestor';
import './style.scss';

const SUPERADMIN = gql`
  {
    superadmin {
      deals {
        _id
        status
        date_closed
        appLink
        slug
        raised
        dealParams {
          wireDeadline
        }
        company_name
        company_description
        target
        amount_raised
        documents {
          link
          path
        }
        organization {
          slug
        }
      }
      organizations {
        _id
        name
        approved
        created_at
        slug
        n_deals
        admins {
          name
        }
      }
      investors {
        _id
        name
        first_name
        last_name
        entity_name
        country
        investor_type
        signer_full_name
        accredited_investor_status
        accredidation_status
        email
        investments {
          amount
        }
        accredidation_doc {
          link
          path
        }
        passport {
          link
          path
        }
      }
    }
  }
`;

const APPROVE_ORG = gql`
  mutation ApproveOrg($org: OrganizationInput!) {
    updateOrganization(organization: $org) {
      _id
    }
  }
`;

export default function SuperAdminOverview() {
  const { data, refetch } = useQuery(SUPERADMIN);
  const [activeDeals, setActiveDeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeData, setActiveData] = useState('orgs');

  useEffect(() => {
    if (data?.superadmin?.deals) {
      setActiveDeals(data.superadmin.deals);
    }
  }, [data]);

  if (!data) return null;

  const { deals, organizations, investors } = data.superadmin;

  const groupedDeals = _.groupBy(deals, 'status');

  const formsMap = {
    orgsForm: <EditOrg orgData={open.org} refetch={refetch} />,
    usersForm: <EditInvestor data={open.investor} refetch={refetch} />,
  };

  let form = null;
  if (open) {
    form = formsMap[open.type];
  }
  return (
    <div className="SuperAdmin">
      <div style={{ marginBottom: '4rem' }}>
        <Row style={{ marginBottom: '1em' }}>
          <Col md={{ size: '3' }}>
            <Paper
              onClick={() => setActiveData('orgs')}
              style={{ padding: '20px', backgroundColor: activeData === 'orgs' ? '#205DF5' : 'white' }}
            >
              <h6 style={{ color: 'rgba(0,0,0,0.3)' }}>Funds</h6>
              <h2 style={{ textAlign: 'center' }}>{organizations?.length}</h2>
            </Paper>
          </Col>

          <Col md={{ size: '3' }}>
            <Paper
              onClick={() => {
                setActiveDeals(groupedDeals.onboarding || []);
                setActiveData('activeDeals');
              }}
              style={{ padding: '20px', backgroundColor: activeData === 'activeDeals' ? '#205DF5' : 'white' }}
            >
              <h6 style={{ color: 'rgba(0,0,0,0.3)' }}>Active Deals</h6>
              <h2 style={{ textAlign: 'center' }}>{_.get(groupedDeals, 'onboarding', []).length}</h2>
            </Paper>
          </Col>

          <Col md={{ size: '3' }}>
            <Paper
              onClick={() => {
                setActiveDeals(groupedDeals.closed || []);
                setActiveData('closedDeals');
              }}
              style={{ padding: '20px', backgroundColor: activeData === 'closedDeals' ? '#205DF5' : 'white' }}
            >
              <h6 style={{ color: 'rgba(0,0,0,0.3)' }}>Closed Deals</h6>
              <h2 style={{ textAlign: 'center' }}>{_.get(groupedDeals, 'closed', []).length}</h2>
            </Paper>
          </Col>

          <Col md={{ size: '3' }}>
            <Paper
              onClick={() => setActiveData('investors')}
              style={{ padding: '20px', backgroundColor: activeData === 'investors' ? '#205DF5' : 'white' }}
            >
              <h6 style={{ color: 'rgba(0,0,0,0.3)' }}>Users</h6>
              <h2 style={{ textAlign: 'center' }}>{investors.length || 0}</h2>
            </Paper>
          </Col>
        </Row>

        <Grid container>
          {activeData === 'orgs' && <FundsTabel organizations={organizations} setOpen={setOpen} />}
          {(activeData === 'activeDeals' || activeData === 'closedDeals') && <DealsTabel activeDeals={activeDeals} />}
          {activeData === 'investors' && <InvestorsTabel investors={investors} setOpen={setOpen} />}
        </Grid>
      </div>

      {/* <Row>
        <Col md={{ size: 6 }}>
          <Paper style={{ padding: '20px' }}>
            <div>
              Funds &nbsp;
              <span className="square-number">{organizations.length}</span>
            </div>
            <Paper style={{ maxHeight: '500px', overflow: 'scroll' }}>
              <Table>
                <TableBody>
                  {organizations.map((org) => (
                    <Org key={org._id} org={org} refetch={refetch} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
        <Col sm={{ size: 6 }}>
          <Paper style={{ padding: '20px' }}>
            <div className="deals-title">
              Deals &nbsp;<span className="square-number">{deals.length}</span>
            </div>
            <Paper style={{ maxHeight: '500px', overflow: 'scroll' }}>
              <Table size="small">
                <TableBody>
                  {deals.map((deal) => (
                    <LegacyDeal key={deal._id} deal={deal} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
      </Row> */}
      <FormModal open={open} setOpen={setOpen} form={form} />
    </div>
  );
}

function Org({ org, refetch, setOpen }) {
  const history = useHistory();
  const [updateOrganization] = useMutation(APPROVE_ORG, {
    onCompleted: refetch,
  });
  const approve = () => {
    updateOrganization({ variables: { org: { _id: org._id, approved: true } } });
  };

  return (
    <TableRow className="org-info">
      <TableCell className="name">
        {org.name}
        {!org.approved && (
          <Button size="small" variant="contained" color="secondary" onClick={approve}>
            approve
          </Button>
        )}
      </TableCell>
      <TableCell>{org.created_at ? formatDate(Number(org.created_at)) : null}</TableCell>
      <TableCell>{org.slug}</TableCell>
      <TableCell>
        {org.approved ? (
          <CheckCircleRoundedIcon color="secondary" style={{ marginLeft: '1.5rem' }} />
        ) : (
          <CancelRoundedIcon color="red" style={{ marginLeft: '1.5rem' }} />
        )}
      </TableCell>
      <TableCell style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          style={{ textTransform: 'lowercase' }}
          color="primary"
          onClick={() => {
            setOpen({ type: 'orgsForm', org });
          }}
        >
          {' '}
          Edit
        </Button>
        <Button
          color="primary"
          style={{ textTransform: 'lowercase' }}
          onClick={() => history.push(`admin/${org.slug}`)}
        >
          {' '}
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

const DealsTabel = ({ activeDeals }) => {
  const [data, setData] = useState(activeDeals);

  useEffect(() => {
    setData(activeDeals);
  }, [activeDeals]);

  console.log(activeDeals, 'asdasdasd');

  const [sortParam, setSortParam] = useState({ direction: 'asce' });

  const headers = [{ prop: 'company_name', display: 'Name' }];

  useEffect(() => {
    if (sortParam?.direction && sortParam?.value) {
      if (sortParam?.direction === 'asce') {
        const sorted = data.sort((a, b) =>
          a[`${_.toLower(_.snakeCase(sortParam?.value))}`].localeCompare(
            b[`${_.toLower(_.snakeCase(sortParam?.value))}`],
          ),
        );
        setData(sorted);
      } else {
        const sorted = data.sort((a, b) =>
          b[`${_.toLower(_.snakeCase(sortParam?.value))}`].localeCompare(
            a[`${_.toLower(_.snakeCase(sortParam?.value))}`],
          ),
        );
        setData(sorted);
      }
    }
  }, [data, sortParam]);

  return (
    <Grid item xs={12}>
      <Paper>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h4" style={{ marginBottom: '20px', padding: '16px', maxWidth: '50%' }}>
              Deals
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SearchBar data={activeDeals} setData={setData} />
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => {
                return (
                  <TableCell
                    onClick={() =>
                      setSortParam({ value: header.prop, direction: sortParam?.direction === 'asce' ? 'desc' : 'asce' })
                    }
                  >
                    {header.display}{' '}
                    {sortParam?.direction === 'asce' && sortParam?.value === header ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )}{' '}
                  </TableCell>
                );
              })}
              <TableCell>Closes</TableCell>
              <TableCell>Progess</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((deal) => {
              return <Deal deal={deal} investments={deal.investments} superadmin />;
            })}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

const FundsTabel = ({ organizations, setOpen }) => {
  const [data, setData] = useState(organizations);
  useEffect(() => {
    setData(organizations);
  }, [organizations]);

  const [sortParam, setSortParam] = useState({ direction: 'asce' });

  const headers = ['Name', 'Created At', 'Slug'];

  useEffect(() => {
    if (sortParam?.direction && sortParam?.value) {
      if (sortParam?.direction === 'asce') {
        const sorted = data.sort((a, b) =>
          a[`${_.toLower(_.snakeCase(_.toString(sortParam?.value)))}`].localeCompare(
            b[`${_.toLower(_.snakeCase(_.toString(sortParam?.value)))}`],
          ),
        );
        setData(sorted);
      } else {
        const sorted = data.sort((a, b) =>
          b[`${_.toLower(_.snakeCase(_.toString(sortParam?.value)))}`].localeCompare(
            a[`${_.toLower(_.snakeCase(_.toString(sortParam?.value)))}`],
          ),
        );
        setData(sorted);
      }
    }
  }, [data, sortParam]);

  return (
    <Grid item xs={12}>
      <Paper>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h4" style={{ marginBottom: '20px', padding: '16px', maxWidth: '50%' }}>
              Funds
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SearchBar data={organizations} setData={setData} />
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => {
                return (
                  <TableCell
                    onClick={() =>
                      setSortParam({ value: header, direction: sortParam?.direction === 'asce' ? 'desc' : 'asce' })
                    }
                  >
                    {header}{' '}
                    {sortParam?.direction === 'asce' && sortParam?.value === header ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )}{' '}
                  </TableCell>
                );
              })}
              <TableCell>Approved</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((org) => {
              return <Org org={org} setOpen={setOpen} />;
            })}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

const InvestorsTabel = ({ investors, setOpen }) => {
  const [data, setData] = useState(investors);
  useEffect(() => {
    setData(investors);
  }, [investors]);

  const [sortParam, setSortParam] = useState({ direction: 'asce' });

  const headers = ['Name', 'Email'];

  useEffect(() => {
    if (sortParam?.direction && sortParam?.value) {
      if (sortParam?.direction === 'asce') {
        const sorted = data.sort((a, b) =>
          a[`${_.toLower(_.snakeCase(sortParam?.value))}`].localeCompare(
            b[`${_.toLower(_.snakeCase(sortParam?.value))}`],
          ),
        );
        setData(sorted);
      } else {
        const sorted = data.sort((a, b) =>
          b[`${_.toLower(_.snakeCase(sortParam?.value))}`].localeCompare(
            a[`${_.toLower(_.snakeCase(sortParam?.value))}`],
          ),
        );
        setData(sorted);
      }
    }
  }, [data, sortParam]);
  return (
    <Grid item xs={12}>
      <Paper>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h4" style={{ marginBottom: '20px', padding: '16px', maxWidth: '50%' }}>
              Users
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SearchBar data={investors} setData={setData} />
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => {
                return (
                  <TableCell
                    onClick={() =>
                      setSortParam({ value: header, direction: sortParam?.direction === 'asce' ? 'desc' : 'asce' })
                    }
                  >
                    {header}{' '}
                    {sortParam?.direction === 'asce' && sortParam?.value === header ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )}{' '}
                  </TableCell>
                );
              })}
              <TableCell>Date Added</TableCell>
              <TableCell>Amount Invested</TableCell>
              <TableCell>Accredidated Investor</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((investor) => {
              return <User investor={investor} setOpen={setOpen} />;
            })}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

const User = ({ investor, setOpen }) => {
  const timestamp = investor._id.toString().substring(0, 8);
  const date = new Date(parseInt(timestamp, 16) * 1000);
  const addedDate = moment(date).format('Do MMMM YYYY, h:mm a');

  return (
    <TableRow>
      <TableCell> {investor.name}</TableCell>
      <TableCell>{investor.email}</TableCell>
      <TableCell>{addedDate}</TableCell>
      <TableCell>${nWithCommas(_.sumBy(investor.investments, 'amount'))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>
        {investor.accredidation_status && <CheckCircleRoundedIcon color="secondary" style={{ marginRight: '.5rem' }} />}
      </TableCell>
      <TableCell>
        <Button
          color="primary"
          style={{ textTransform: 'lowercase' }}
          onClick={() => {
            setOpen({ type: 'usersForm', investor });
          }}
        >
          {' '}
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

const SearchBar = ({ data, setData }) => {
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    const filtered = data.filter((obj) => {
      const matched = Object.values(obj).filter((v) => {
        const value = _.toLower(_.toString(v));
        return value.includes(_.toLower(searchTerm));
      });
      return matched.length >= 1;
    });
    setData(filtered);
  };
  return (
    <>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          style={{ width: '100%', paddingRight: '1rem', marginTop: '.5rem' }}
          onChange={handleChange}
          label="Search"
          variant="outlined"
        />
      </Grid>
    </>
  );
};
