import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';
import './style.scss';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormError from '../forms/Error';
import { useSimpleReducer } from '../../utils/hooks';

/** *
 *
 * creat deal interface that redirects to DealEdit on creation
 *
 * */

const CREATE_DEAL = gql`
  mutation CreateDeal($org: String!, $deal: DealInput!) {
    createDeal(org: $org, deal: $deal) {
      _id
    }
  }
`;

const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!, $status: String) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals(status: $status) {
        _id
        raised
        appLink
        status
        date_closed
        dealParams {
          wireDeadline
          dealMultiple
        }
        company_name
        company_description
        target
        investments {
          amount
          investor {
            investingAs
          }
        }
      }
    }
    investor {
      _id
      admin
      documents
    }
  }
`;

const emptyDeal = {
  company_name: '',
  deal_lead: '',
  company_description: '',
  date_closed: '',
  onboarding_link: '',
  pledge_link: '',
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    maxWidth: 800,
    marginBottom: theme.spacing(4),
  },
  divider: {
    margin: '16px -16px',
  },
  table: {
    width: 'calc(100% + 32px)',
    margin: '16px -16px',
  },
}));

export default function DealNew() {
  const classes = useStyles();
  const history = useHistory();
  const { organization } = useParams();
  const [deal, setDeal] = useSimpleReducer(emptyDeal);
  const [hasChanges, setHasChanges] = useState(false);
  const [createDeal, { error }] = useMutation(CREATE_DEAL, {
    refetchQueries: [{ query: ORG_OVERVIEW, variables: { slug: organization } }],
    onCompleted: ({ createDeal }) =>
      history.push(`/admin/${organization}/deals/${createDeal._id}/edit`),
  });

  useEffect(() => {
    setHasChanges(!isEqual(deal, {}));
  }, [deal]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" gutterBottom>
        Create Deal
      </Typography>
      <Typography variant="subtitle2" style={{ marginBottom: 16 }}>
        Please double check your input
      </Typography>
      <form className="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} item>
            <TextField
              style={{ width: '100%' }}
              value={deal.company_name}
              onChange={(e) => setDeal({ company_name: e.target.value })}
              label="Company Name"
              variant="outlined"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              style={{ width: '100%' }}
              value={deal.deal_lead}
              onChange={(e) => setDeal({ deal_lead: e.target.value })}
              label="Deal Lead"
              variant="outlined"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              style={{ width: '100%' }}
              value={deal.company_description}
              onChange={(e) => setDeal({ company_description: e.target.value })}
              label="Company Description"
              variant="outlined"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              style={{ width: '100%' }}
              value={deal.date_closed}
              onChange={(e) => setDeal({ date_closed: e.target.value })}
              label="Closing Date"
              variant="outlined"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              style={{ width: '100%' }}
              value={deal.pledge_link}
              onChange={(e) => setDeal({ pledge_link: e.target.value })}
              label="Pledge Link"
              variant="outlined"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              style={{ width: '100%' }}
              value={deal.onboarding_link}
              onChange={(e) => setDeal({ onboarding_link: e.target.value })}
              label="Onboarding Link"
              variant="outlined"
            />
          </Grid>

          <Grid xs={12} sm={6} item>
            <Button
              disabled={!hasChanges}
              variant="contained"
              fullWidth
              onClick={() => createDeal({ variables: { org: organization, deal } })}
              color="primary"
            >
              CREATE
            </Button>
          </Grid>
        </Grid>

        <FormError error={error} />
      </form>
    </Paper>
  );
}
