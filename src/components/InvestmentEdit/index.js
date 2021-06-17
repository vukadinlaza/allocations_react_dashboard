import React, { useState, useEffect } from 'react';
import { get, isEqual, pick } from 'lodash';
import { useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, TextField, Divider, Grid, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../utils/Loader';
import { destroy } from '../../api/investments';
/** *
 *
 * investment edit and add docs for an investment
 *
 * */
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    maxWidth: 800,
    marginBottom: theme.spacing(4),
  },
  divider: {
    margin: '16px -16px',
  },
}));
const GET_INVESTMENT = gql`
  query GetInvestment($_id: String!) {
    investment(_id: $_id) {
      _id
      amount
      status
      documents {
        link
        path
      }
      deal {
        _id
        company_name
        company_description
      }
      investor {
        _id
        first_name
        last_name
        entity_name
        investor_type
        investingAs
      }
    }
  }
`;
const ADD_INVESTMENT_DOC = gql`
  mutation AddInvestmentDoc($doc: Upload!, $investment_id: String!, $isK1: Boolean) {
    addInvestmentDoc(doc: $doc, investment_id: $investment_id, isK1: $isK1)
  }
`;
const RM_INVESTMENT_DOC = gql`
  mutation RmInvestmentDoc($file: String!, $investment_id: String!) {
    rmInvestmentDoc(file: $file, investment_id: $investment_id)
  }
`;
const UPDATE_INVESTMENT = gql`
  mutation UpdateInvestment($investment: InvestmentInput!) {
    updateInvestment(investment: $investment) {
      _id
    }
  }
`;
export default function InvestmentEdit({ investmentId = false, isK1 = false, setEditInvestmentModal }) {
  const params = useParams();
  const [investment, setInvestment] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const id = investmentId || params.id;
  const classes = useStyles();
  const { data, refetch, loading } = useQuery(GET_INVESTMENT, { variables: { _id: id } });
  const [createInvestment, createInvestmentRes] = useMutation(UPDATE_INVESTMENT);
  const [deleteInvestment] = useMutation(destroy, {
    onCompleted: () => {
      toast.success('Sucess! Investment Deleted.');
      setEditInvestmentModal(false);
    },
    onError: (e) => {
      toast.error('Looks like we encountered an error.');
    },
  });

  useEffect(() => {
    setHasChanges(!isEqual(investment, {}));
  }, [investment]);

  useEffect(() => {
    if (data && !loading) setInvestment(data.investment);
  }, [data, investment, loading]);

  const updateInvestmentProp = ({ prop, newVal }) => {
    setInvestment((prev) => ({ ...prev, [prop]: newVal }));
  };

  if (createInvestmentRes.data?.createInvestment?._id) {
    return <Redirect to={`/deals/${createInvestmentRes.data.createInvestment._id}/edit`} />;
  }

  const name =
    get(investment, 'investor.investor_type') === 'entity'
      ? get(investment, 'investor.entity_name') || ''
      : `${get(investment, 'investor.first_name')} ${get(investment, 'investor.last_name')}`;

  return (
    <div className="InvestmentEdit form-wrapper">
      <div className="form-title">
        Update Investment {createInvestmentRes.data && <FontAwesomeIcon icon="check" />}{' '}
      </div>
      <Divider className={classes.divider} />
      <form className="form" noValidate autoComplete="off">
        <Grid container spacing={3} direction="row" justify="flex-end">
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField style={{ width: '100%' }} value={name || ''} disabled label="Investor" variant="outlined" />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                value={get(investment, 'amount', '') || 0}
                onChange={(e) => updateInvestmentProp({ prop: 'amount', newVal: parseInt(e.target.value) })}
                label="Amount"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                value={`${get(investment, 'deal.company_name', '')} ${get(investment, 'deal.company_description', '')}`}
                label="Deal"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl variant="outlined" style={{ width: '100%' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={investment?.status || ''}
                onChange={(e) => updateInvestmentProp({ prop: 'status', newVal: e.target.value })}
                inputProps={{ name: 'status' }}
              >
                <MenuItem value="invited">Invited</MenuItem>
                <MenuItem value="signed">Signed</MenuItem>
                <MenuItem value="wired">Wired</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Button
              disabled={!hasChanges}
              variant="contained"
              style={{ width: '5rem' }}
              onClick={() =>
                createInvestment({
                  variables: {
                    investment: { ...pick(investment, ['_id', 'status', 'amount']) },
                  },
                })
              }
              color="primary"
            >
              UPDATE
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: 'red', width: '5rem', marginTop: '5px' }}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this investment?')) {
                  return deleteInvestment({ variables: { id: investmentId } });
                }
              }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid item xs={12} sm={12} md={6}>
          <div className="form-sub-title">Documents</div>
          <Docs investment={investment} setInvestment={setInvestment} refetch={refetch} isK1={isK1} />
        </Grid>
      </form>
    </div>
  );
}

function Docs({ investment, setInvestment, refetch, isK1 }) {
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [addInvestmentDoc, { loading }] = useMutation(ADD_INVESTMENT_DOC);
  const id = get(investment, '_id', '');
  useEffect(() => {
    if (uploadedDoc) {
      addInvestmentDoc({
        variables: { doc: uploadedDoc, investment_id: id, isK1 },
        onCompleted: () => {
          console.log('Doc is uploaed');
          refetch();
          toast.success('Sucess!');
        },
      });
    }
  }, [addInvestmentDoc, id, isK1, refetch, uploadedDoc]);
  const docs = get(investment, 'documents', []);

  if (loading || !investment) return <Loader />;

  return (
    <div className="docs">
      <div className="doc-wrapper">
        <div className="add-doc">
          <label>
            <FontAwesomeIcon icon="plus" />
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={({ target }) => {
                if (target.validity.valid) setUploadedDoc(target.files[0]);
              }}
            />
          </label>
        </div>
        <div className="filename">&nbsp;</div>
      </div>
      {docs.map((doc) => (
        <Doc key={doc.path} doc={doc} investment={investment} refetch={refetch} />
      ))}
    </div>
  );
}

function Doc({ doc, investment, refetch }) {
  const file = doc.path.slice(0, 12) === 'investments/' ? doc.path.split('/')[2] : doc.path.split('/')[1];
  const [rmInvestmentDoc] = useMutation(RM_INVESTMENT_DOC, {
    variables: { file, investment_id: investment._id },
    onCompleted: () => {
      refetch();
      toast.success('File has been deleted');
    },
    onError: () => {
      toast.error('Looks like we encountered an error.');
    },
  });
  const rmDoc = () => {
    if (window.confirm(`Delete ${file}?`)) rmInvestmentDoc();
  };

  return (
    <div className="doc-wrapper">
      <div className="doc">
        <FontAwesomeIcon icon="times-circle" onClick={rmDoc} />
        <FontAwesomeIcon icon={['far', 'file-pdf']} />
      </div>
      <div className="filename">
        <span>
          <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
            {file}
          </a>
        </span>
      </div>
    </div>
  );
}
