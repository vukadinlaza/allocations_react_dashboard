/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import _, { get, isEqual, pick } from 'lodash';
import { useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { Icon, colors } from '@allocations/design-system';
import {
  Button,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  Tooltip,
  InputAdornment,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Loader from '../../utils/Loader';
import { destroy } from '../../../api/investments';
import DocumentIcon from '../../../assets/document-icon.svg';
import styles from '../styles';

/** *
 *
 * Update investment and add docs for an investment
 * Slight refactor of index.js in InvestmemtEdit with the goal of making this reusable
 * and migrating to this component once New Fund Dashboard is completed.
 * */
const GET_INVESTMENT = gql`
  query GetInvestment($_id: String!) {
    investment(_id: $_id) {
      _id
      amount
      capitalWiredAmount
      status
      wired_at
      documents {
        link
        path
      }
      submissionData {
        legalName
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
        email
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

const UPDATE_USER = gql`
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
      _id
    }
  }
`;

function Doc({ doc, investment, getInvestment, matches }) {
  const file = doc.path.includes('/')
    ? doc.path.slice(0, 12) === 'investments/'
      ? doc.path.split('/')[2]
      : doc.path.split('/')[1]
    : doc.path;

  const [rmInvestmentDoc] = useMutation(RM_INVESTMENT_DOC, {
    variables: { file, investment_id: investment._id },
    onCompleted: () => {
      getInvestment();
      toast.success('Success! Document deleted');
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
    },
  });

  const rmDoc = () => {
    // eslint-disable-next-line no-alert
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
        <img src={DocumentIcon} alt="document icon" style={{ height: '28px' }} />
      </Grid>
      <Grid item>
        <Tooltip title={file}>
          <Typography align="center" style={{ fontSize: '14px' }}>
            <a
              href={doc.link.includes('http') ? doc.link : `https://${doc.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {_.truncate(file, { length: 25 })}
            </a>
          </Typography>
        </Tooltip>
      </Grid>
      <Grid item>
        <Box onClick={rmDoc} style={{ cursor: 'pointer' }}>
          <Icon iconColor={colors.error[500]} iconName="clear" />
        </Box>
      </Grid>
    </Grid>
  );
}

function Docs({ investment, getInvestment, isK1 }) {
  const matches = useMediaQuery('(min-width:600px)');
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const [addInvestmentDoc, { loading }] = useMutation(ADD_INVESTMENT_DOC, {
    onCompleted: () => {
      getInvestment();
      toast.success('Success! Document added');
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
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
          <img src={DocumentIcon} alt="document icon" style={{ height: '28px' }} />
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
          shrink={false}
        >
          <Typography style={{ color: colors.black[50], fontSize: '14px' }}>
            Add New Document
          </Typography>
          <input
            id="fileUpload"
            type="file"
            style={{ display: 'none' }}
            onChange={({ target }) => {
              if (target.validity.valid) setUploadedDoc(target.files[0]);
            }}
          />

          <Box>
            <Icon iconColor={colors.success[500]} iconName="add" />
          </Box>
        </InputLabel>
      </Grid>
    </Grid>
  );
}

export default function InvestmentEdit({
  investmentId = false,
  isK1 = false,
  handleUpdate = false,
}) {
  const classes = styles();
  const params = useParams();
  const [investment, setInvestment] = useState(null);
  const [user, setUser] = useState();
  const [hasInvestmentChanges, setHasInvestmentChanges] = useState(false);
  const [hasUserChanges, setHasUserChanges] = useState(false);
  const [errors, setErrors] = useState([]);
  const id = investmentId || params.id;

  const oldDatabaseWireDate = !investment?.wired_at ? '' : new Date(investment?.wired_at * 1);
  const oldDatabaseWireDateTime = moment.utc(oldDatabaseWireDate).format('yyy-MM-DD');

  const [getInvestment, { data, loading }] = useLazyQuery(GET_INVESTMENT, {
    variables: { _id: id },
  });

  useEffect(() => {
    if (!data) {
      // fixes bug where you cant edit anything because we keep making get requests to get the investment
      getInvestment();
    }
  }, []);

  const [updateInvestment, createInvestmentRes] = useMutation(UPDATE_INVESTMENT, {
    onCompleted: () => {
      toast.success('Success! Investment updated');
      setErrors([]);

      if (handleUpdate) {
        handleUpdate.refetch();
      }
      getInvestment();
    },
    onError: () =>
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com'),
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast.success('Success! Investor updated');
      if (handleUpdate) {
        handleUpdate.refetch();
      }
      getInvestment();
    },
    onError: () =>
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com'),
  });

  const [deleteInvestment] = useMutation(destroy, {
    onCompleted: () => {
      if (handleUpdate) {
        handleUpdate.refetch();
        handleUpdate.closeModal();
      }
      toast.success('Success! Investment deleted');
    },
    onError: () =>
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com'),
  });

  useEffect(() => {
    setHasInvestmentChanges(!isEqual(investment, data?.investment));
  }, [investment, data?.investment]);

  useEffect(() => {
    if (data && !loading) {
      setInvestment(data.investment);
      setUser(get(data, 'investment.investor', {}));
    }
  }, [data, loading]);

  const updateInvestmentProp = ({ prop, newVal }) => {
    if (prop === 'accredidation_status') {
      setUser((prev) => {
        const data = {
          ...prev,
          accredidation_status: newVal,
        };
        setHasUserChanges(!isEqual(data, prev));
        return data;
      });
    } else if (prop === 'wired_at') {
      setInvestment((prev) => ({ ...prev, wired_at: Date.parse(newVal) }));
    } else {
      setInvestment((prev) => ({ ...prev, [prop]: newVal }));
    }
  };

  /* form validation */
  const validate = (updatedInvestment) => {
    const errors = [];

    (updatedInvestment?.status === 'wired' || updatedInvestment?.status === 'complete') &&
    !updatedInvestment?.capitalWiredAmount
      ? errors.push('capitalWiredAmount')
      : errors.push();

    (updatedInvestment?.status === 'wired' || updatedInvestment?.status === 'complete') &&
    !updatedInvestment?.wired_at
      ? errors.push('wired_at')
      : errors.push();

    return errors;
  };

  const handleInvestmentEdit = () => {
    const e = validate(investment);

    if (e.length > 1) {
      toast.error('Error. Please supply the required fields.');
      return setErrors(e);
    }
    if (e.includes('wired_at')) {
      toast.error('Error. Please supply wired date.');
      return setErrors(e);
    }
    if (e.includes('capitalWiredAmount')) {
      toast.error('Error. Please supply amount received.');
      return setErrors(e);
    }

    if (hasInvestmentChanges) {
      updateInvestment({
        variables: {
          investment: {
            ...pick(investment, ['_id', 'status', 'amount', 'capitalWiredAmount', 'wired_at']),
          },
        },
      });
      setHasInvestmentChanges(false);
    }

    if (hasUserChanges) {
      updateUser({
        variables: {
          input: {
            ...pick(user, ['_id', 'accredidation_status']),
          },
        },
      });
      setHasUserChanges(false);
    }
  };

  if (createInvestmentRes.data?.createInvestment?._id) {
    return <Redirect to={`/deals/${createInvestmentRes.data.createInvestment._id}/edit`} />;
  }

  const name = function name() {
    if (get(investment, 'investor.investor_type') === 'entity') {
      return get(investment, 'investor.entity_name');
    }
    if (get(investment, 'investor.first_name') && get(investment, 'investor.last_name')) {
      return `${get(investment, 'investor.first_name')} ${get(investment, 'investor.last_name')}`;
    }
    if (get(investment, 'submissionData.legalName')) {
      return get(investment, 'submissionData.legalName');
    }
    return get(investment, 'investor.email');
  };

  const convertToPositiveInteger = (num) => {
    return Number(num < 0 ? 0 : num);
  };

  return (
    <div className={classes.investmentEdit}>
      <div className={classes.title}>Update Investment</div>
      <form noValidate autoComplete="off">
        <Grid container spacing={3}>
          {/* investor name */}
          <Grid item xs={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                value={name() || ''}
                disabled
                label="Investor"
                variant="outlined"
              />
            </FormControl>
          </Grid>

          {/* investment deal name */}
          <Grid item xs={12} md={6}>
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

          {/* investment committed amount */}
          <Grid item xs={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={investment?.amount || undefined}
                placeholder="0"
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

          {/* investment wired amount */}
          <Grid item xs={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                error={errors.includes('capitalWiredAmount')}
                disabled={investment?.status === 'signed' || investment?.status === 'invited'}
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={investment?.capitalWiredAmount || undefined}
                placeholder="0"
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

          {/* investment status */}
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" style={{ width: '100%' }} size="small">
              <TextField
                select
                label="Status"
                variant="outlined"
                size="small"
                value={investment?.status || ''}
                onChange={(e) => updateInvestmentProp({ prop: 'status', newVal: e.target.value })}
              >
                <MenuItem value="invited">Invited</MenuItem>
                <MenuItem value="signed">Signed</MenuItem>
                <MenuItem value="wired">Wired</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          {/* investment wire date */}
          {(investment?.status === 'wired' || investment?.status === 'complete') && (
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" style={{ width: '100%' }} size="small">
                <TextField
                  value={oldDatabaseWireDateTime || ''}
                  error={errors.includes('wired_at')}
                  onChange={(e) =>
                    updateInvestmentProp({ prop: 'wired_at', newVal: e.target.value })
                  }
                  disabled={investment?.status === 'signed' || investment?.status === 'invited'}
                  type="date"
                  label="Wired Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>

        <div className={classes.title}>Update Investor Accreditation</div>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FormControl
            variant="outlined"
            style={{ width: '100%', marginBottom: '15px' }}
            size="small"
          >
            <InputLabel>Accreditation Status</InputLabel>
            <Select
              value={user?.accredidation_status || false}
              onChange={(e) =>
                updateInvestmentProp({
                  prop: 'accredidation_status',
                  newVal: e.target.value,
                })
              }
              inputProps={{ name: 'accredidation_status' }}
            >
              <MenuItem value>The investor is accredited</MenuItem>
              <MenuItem value={false}>The investor is not accredited</MenuItem>
            </Select>
          </FormControl>
        </Grid>

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
              disabled={!hasInvestmentChanges && !hasUserChanges}
              variant="contained"
              style={{ backgroundColor: colors.black[50] }}
              onClick={handleInvestmentEdit}
              color="primary"
            >
              UPDATE
            </Button>
            <Button
              style={{ marginTop: '5px', color: colors.error[600] }}
              onClick={() => {
                // eslint-disable-next-line no-alert
                if (window.confirm('Are you sure you want to delete this investment?')) {
                  return deleteInvestment({ variables: { id: investmentId } });
                }
              }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>

        <Grid container>
          <div className={classes.title} style={{ color: colors.black[50], margin: '15px 0' }}>
            Documents
          </div>
        </Grid>
        <Docs investment={investment} getInvestment={getInvestment} isK1={isK1} />
      </form>
    </div>
  );
}
