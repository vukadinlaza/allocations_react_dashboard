import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useMutation, gql } from '@apollo/client';
import { get, pick } from 'lodash';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: '16px -16px',
  },
  tabs: {
    borderTop: `1px solid ${theme.colors.gray[200]}`,
    borderBottom: `1px solid ${theme.colors.gray[200]}`,
    background: theme.colors.gray[50],
    minHeight: 44,
    margin: '40px 0',
  },
  text: {
    color: theme.colors.gray[400],
  },
  tab: {
    height: 42,
    width: '100%',
  },
  subtitle: {
    color: theme.colors.gray[600],
    marginTop: 16,
  },
  activeTab: {
    height: 42,
    paddingTop: 3,
    width: '100%',
    borderBottom: `3px solid ${theme.colors.primary[600]}`,
    outline: '0 !important',
  },
  button: {
    margin: '.5rem',
  },
  orgName: {
    color: theme.colors.gray[600],
    fontWeight: 'bolder',
  },
}));

const UPDATE_ORG = gql`
  mutation UpdateOrganization($organization: OrganizationInput!) {
    updateOrganization(organization: $organization) {
      _id
      name
      slug
    }
  }
`;
function EditOrg({ orgData, refetch }) {
  const classes = useStyles();
  const [organization, setOrganization] = useState(null);
  const [updateOrganization, { data }] = useMutation(UPDATE_ORG);

  useEffect(() => {
    if (orgData) {
      setOrganization(pick(orgData, ['name', '_id', 'slug']));
    }
  }, [orgData]);

  useEffect(() => {
    if (data?.updateOrganization?.slug) {
      refetch();
    }
  }, [data]);

  const handleChange = (prop) => (e) => {
    e.persist();
    return setOrganization((prev) => ({ ...prev, [prop]: e.target.value }));
  };
  return (
    <>
      <Paper className={classes.paper} style={{ marginBottom: 16 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={12}>
            <form noValidate autoComplete="off" style={{ padding: '16px' }}>
              <Typography variant="subtitle2" style={{ marginBottom: '16px' }}>
                This information can be edited from your organization settings page.
              </Typography>
              <Grid container spacing={3} style={{ marginTop: '16px' }}>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    value={get(organization, 'name') || ''}
                    onChange={handleChange('name')}
                    label="Organization Name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    required
                    style={{ width: '100%' }}
                    value={get(organization, 'slug') || ''}
                    onChange={handleChange('slug')}
                    label="Organization Slug (URL)"
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                style={{ marginTop: 16 }}
                onClick={() =>
                  updateOrganization({
                    variables: { organization },
                    onCompleted: toast.success('Success!'),
                  })
                }
                color="primary"
              >
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default EditOrg;
