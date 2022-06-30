import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import * as API from '../../api';

import InvestorNew from '../InvestorNew';
import styles from './styles';

/** *
 *
 * create new investment form
 *
 * */

const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`;

function validate({ investment, user, deal }) {
  const errors = [];
  if (!investment.amount) errors.push('amount');
  if (!user) errors.push('user');
  if (!deal) errors.push('deal');
  return errors;
}

export function UserSearch({ user, setUser, errors, org_id }) {
  const classes = styles();
  const [q, setQ] = useState('');
  const [records, setRecords] = useState([]);
  const [search, searchRes] = useLazyQuery(API.users.search);

  useEffect(() => {
    search({ variables: { query: q, org_id } });
  }, [org_id, q, search]);

  useEffect(() => {
    if (searchRes.data && searchRes.data.users) {
      setRecords(q === '' ? [] : searchRes.data.users);
    }
  }, [q, searchRes.data]);

  if (user) {
    return (
      <Paper>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <FontAwesomeIcon
                  icon="times"
                  onClick={() => {
                    setQ('');
                    setUser(null);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }

  return (
    <div>
      <TextField
        style={{ width: '100%' }}
        required
        value={q}
        error={errors.includes('user')}
        label="Investor"
        variant="outlined"
        onChange={(e) => setQ(e.target.value)}
      />
      <Paper>
        <Table>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record._id}
                className={classes.assocOption}
                onClick={() => setUser(record)}
              >
                <TableCell>
                  {record.first_name} {record.last_name}
                </TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

function DealSearch({ deal, setDeal, errors, classes }) {
  const [q, setQ] = useState('');
  const [records, setRecords] = useState([]);
  const [search, searchRes] = useLazyQuery(API.deals.search);

  useEffect(() => {
    search({ variables: { q } });
  }, [q, search]);

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchDeals) {
      setRecords(q === '' ? [] : searchRes.data.searchDeals);
    }
  }, [q, searchRes.data]);

  if (deal) {
    return (
      <Paper>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{deal.company_name}</TableCell>
              <TableCell>{deal.company_description}</TableCell>
              <TableCell>
                <FontAwesomeIcon
                  icon="times"
                  onClick={() => {
                    setQ('');
                    setDeal(null);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }

  return (
    <div>
      <TextField
        required
        style={{ width: '100%' }}
        value={q}
        label="Deal"
        variant="filled"
        error={errors.includes('user')}
        onChange={(e) => setQ(e.target.value)}
      />
      <Paper>
        <Table>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record._id}
                className={classes.assocOption}
                onClick={() => setDeal(record)}
              >
                <TableCell>{record.company_name}</TableCell>
                <TableCell>{record.company_description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default function InvestmentNew() {
  const [investment, setInvestment] = useState({ amount: '' });
  const [createInvestment] = useMutation(CREATE_INVESTMENT);
  const [errors, setErrors] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState(null);
  const [deal, setDeal] = useState(null);
  const classes = styles();

  const updateInvestmentProp = ({ prop, newVal }) => {
    setInvestment((prev) => ({ ...prev, [prop]: newVal }));
  };

  const submit = () => {
    const validation = validate({ investment, user, deal });
    setErrors(validation);
    if (validation.length === 0) {
      createInvestment({
        variables: {
          investment: {
            amount: Math.floor(investment.amount),
            user_id: user._id,
            deal_id: deal._id,
          },
        },
        onCompleted: toast.success('Success!'),
      });
      setInvestment({ amount: '' });
    }
  };

  return (
    <>
      {newUser && <InvestorNew push={false} setNewUser={setNewUser} />}
      {!newUser && (
        <FormControlLabel
          label="Create New user"
          control={
            <Checkbox
              color="primary"
              checked={newUser}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={(e) => setNewUser(e.target.checked)}
            />
          }
        />
      )}
      <Paper>
        <div>
          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
              <div>Create Investment</div>
            </Col>
          </Row>
          <form noValidate autoComplete="off">
            <Row>
              <Col sm={{ size: 8, offset: 1 }}>
                <TextField
                  required
                  error={errors.includes('amount')}
                  style={{ width: '100%' }}
                  value={investment.amount}
                  onChange={(e) => updateInvestmentProp({ prop: 'amount', newVal: e.target.value })}
                  label="Amount"
                  variant="filled"
                />
              </Col>
            </Row>
            <Row>
              <Col sm={{ size: 4, offset: 1 }}>
                <UserSearch
                  user={user}
                  setUser={setUser}
                  errors={errors}
                  org_id={get(deal, 'organization', '')}
                  classes={classes}
                />
              </Col>
              <Col sm={{ size: 4 }}>
                <DealSearch deal={deal} setDeal={setDeal} errors={errors} classes={classes} />
              </Col>
            </Row>
            <Row>
              <Col sm={{ size: 8, offset: 1 }}>
                <Button variant="contained" onClick={submit} color="primary">
                  CREATE
                </Button>
              </Col>
            </Row>
            <Row />
          </form>
        </div>
      </Paper>
    </>
  );
}
