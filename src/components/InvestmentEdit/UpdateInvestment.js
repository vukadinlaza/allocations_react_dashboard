import React, { useState, useEffect } from 'react';
import { get, isEqual, pick } from 'lodash';
import { useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Button,
  TextField,
  Divider,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Loader from '../utils/Loader';
import { destroy } from '../../api/investments';
import DocumentIcon from '../svg/DocumentIcon';
import CrossOrPlusIcon from '../svg/CrossOrPlusIcon';

/** *
 *
 * Update investment and add docs for an investment
 * Slight refactor of index.js in InvestmemtEdit with the goal of making this reusable
 * and migrating to this component once New Fund Dashboard is completed.
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
      capitalWiredAmount
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
        accredidation_status
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
export default function InvestmentEdit({
  investmentId = false,
  isK1 = false,
  handleUpdate = false,
}) {
  const classes = useStyles();
  const params = useParams();
  const [investment, setInvestment] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const id = investmentId || params.id;

  const {
    data,
    refetch: getInvestment,
    loading,
  } = useQuery(GET_INVESTMENT, {
    variables: { _id: id },
    fetchPolicy: 'network-only',
  });

  const [updateInvestment, createInvestmentRes] = useMutation(UPDATE_INVESTMENT, {
    onCompleted: () => {
      toast.success('Success! Investment Updated.');
      if (handleUpdate) {
        handleUpdate();
      }
      getInvestment();
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        'Something went wrong updating the investment. Try again or contact support@allocations.com',
      );
    },
  });
  const [deleteInvestment] = useMutation(destroy, {
    onCompleted: () => {
      if (handleUpdate) {
        handleUpdate.refetch();
        handleUpdate.closeModal();
      }
      toast.success('Success! Investment Deleted.');
    },
    onError: () => {
      toast.error(
        'Something went wrong deleting the investment. Try again or contact support@allocations.com',
      );
    },
  });

  useEffect(() => {
    setHasChanges(!isEqual(investment, {}));
  }, [investment]);

  useEffect(() => {
    if (data && !loading) setInvestment(data.investment);
  }, [data, loading]);

  const updateInvestmentProp = ({ prop, newVal }) => {
    // if 'accredidation_status' ...
    console.log('TYPE', typeof newVal, newVal);
    setInvestment((prev) => ({ ...prev, [prop]: newVal }));
  };

  if (createInvestmentRes.data?.createInvestment?._id) {
    return <Redirect to={`/deals/${createInvestmentRes.data.createInvestment._id}/edit`} />;
  }

  const name =
    get(investment, 'investor.investor_type') === 'entity'
      ? get(investment, 'investor.entity_name') || ''
      : `${get(investment, 'investor.first_name')} ${get(investment, 'investor.last_name')}`;

  const convertToPositiveInteger = (num) => {
    return parseInt(num < 0 ? 0 : num);
  };

  return (
    <div className="InvestmentEdit form-wrapper">
      <div className="form-title">Update Investment</div>
      <Divider className={classes.divider} />
      <form className="form" noValidate autoComplete="off">
        <Grid container spacing={3} direction="row" justify="flex-end">
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                value={name || ''}
                disabled
                label="Investor"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                value={`${get(investment, 'deal.company_name', '')} ${get(
                  investment,
                  'deal.company_description',
                  '',
                )}`}
                disabled
                label="Deal"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={get(investment, 'amount', '') || 0}
                onChange={(e) =>
                  // eslint-disable-next-line radix
                  updateInvestmentProp({
                    prop: 'amount',
                    newVal: convertToPositiveInteger(e.target.value),
                  })
                }
                label="Amount Committed"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={get(investment, 'capitalWiredAmount', '') || 0}
                onChange={(e) =>
                  // eslint-disable-next-line radix
                  updateInvestmentProp({
                    prop: 'capitalWiredAmount',
                    newVal: convertToPositiveInteger(e.target.value),
                  })
                }
                label="Amount Received"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
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
        </Grid>

        <div className="form-title">Update Investment</div>
        <Divider className={classes.divider} />

        {/* need to figure out state */}
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <FormControl variant="outlined" style={{ width: '100%' }}>
            <InputLabel>Accreditation Status</InputLabel>
            <Select
              value={investment?.investor?.accredidation_status || false}
              onChange={(e) =>
                updateInvestmentProp({
                  prop: 'accredidation_status',
                  newVal: e.target.value,
                })
              }
              inputProps={{ name: 'accredidation_status' }}
            >
              <MenuItem value="true">The investor is accredited</MenuItem>
              <MenuItem value="false">The investor is not accredited</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}

        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Button
              disabled={!hasChanges}
              variant="contained"
              style={{ backgroundColor: '#2A2B54' }}
              onClick={() =>
                updateInvestment({
                  variables: {
                    investment: {
                      ...pick(investment, ['_id', 'status', 'amount', 'capitalWiredAmount']),
                    },
                  },
                })
              }
              color="primary"
            >
              UPDATE
            </Button>
            <Button
              style={{ marginTop: '5px', color: '#FF0404' }}
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
        <Grid container>
          <div className="form-sub-title" style={{ color: '#2A2B54' }}>
            Documents
          </div>
        </Grid>
        <Docs investment={investment} getInvestment={getInvestment} isK1={isK1} />
      </form>
    </div>
  );
}

function Docs({ investment, getInvestment, isK1 }) {
  const matches = useMediaQuery('(min-width:600px)');
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const [addInvestmentDoc, { loading }] = useMutation(ADD_INVESTMENT_DOC, {
    onCompleted: () => {
      getInvestment();
      toast.success('Success! Document Added');
    },
    onError: () => {
      toast.error(
        'Something went wrong adding the document. Try again or contact support@allocations.com',
      );
    },
  });

  const id = get(investment, '_id', '');

  useEffect(() => {
    if (uploadedDoc) {
      addInvestmentDoc({
        variables: { doc: uploadedDoc, investment_id: id, isK1 },
      });
    }
  }, [addInvestmentDoc, id, isK1, getInvestment, uploadedDoc]);
  const docs = get(investment, 'documents', []);

  if (loading || !investment) return <Loader />;

  return (
    <Grid container wrap="nowrap" direction={matches ? 'row' : 'column'}>
      <Grid container>
        {docs.map((doc) => (
          <Doc
            key={doc.path}
            doc={doc}
            investment={investment}
            getInvestment={getInvestment}
            matches={matches}
          />
        ))}
      </Grid>

      <Grid
        container
        wrap="nowrap"
        justify="space-evenly"
        alignItems="center"
        style={{ padding: matches ? '10px' : '10px 0' }}
      >
        <Grid item>
          <DocumentIcon />
        </Grid>

        <InputLabel
          htmlFor="fileUpload"
          style={{
            margin: 0,
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <Typography style={{ color: '#2A2B54' }}>Add New Document</Typography>
          <input
            id="fileUpload"
            type="file"
            style={{ display: 'none' }}
            onChange={({ target }) => {
              if (target.validity.valid) setUploadedDoc(target.files[0]);
            }}
          />

          <Box>
            <CrossOrPlusIcon />
          </Box>
        </InputLabel>
      </Grid>
    </Grid>
  );
}

function Doc({ doc, investment, getInvestment, matches }) {
  const file =
    doc.path.slice(0, 12) === 'investments/' ? doc.path.split('/')[2] : doc.path.split('/')[1];

  const [rmInvestmentDoc] = useMutation(RM_INVESTMENT_DOC, {
    variables: { file, investment_id: investment._id },
    onCompleted: () => {
      getInvestment();
      toast.success('Success! Document Deleted');
    },
    onError: () => {
      toast.error(
        'Something went wrong deleting the document. Try again or contact support@allocations.com',
      );
    },
  });

  const rmDoc = () => {
    if (window.confirm(`Delete ${file}?`)) rmInvestmentDoc();
  };

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-evenly"
      alignItems="center"
      style={{ padding: matches ? '10px' : '10px 0' }}
    >
      <Grid item>
        <DocumentIcon />
      </Grid>
      <Grid item>
        <Typography align="center">
          <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
            {file}
          </a>
        </Typography>
      </Grid>
      <Grid item>
        <Box onClick={rmDoc} style={{ cursor: 'pointer' }}>
          <CrossOrPlusIcon type="cross" />
        </Box>
      </Grid>
    </Grid>
  );
}
