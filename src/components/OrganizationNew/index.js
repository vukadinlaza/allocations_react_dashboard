import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { Col } from 'reactstrap';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';
import { Button, TextField, Paper, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import { useSimpleReducer } from '../../utils/hooks';

/** *
 *
 * create org for with name and logo (optional)
 *
 * */

const CREATE_ORG = gql`
  mutation CreateOrg($organization: OrganizationInput!) {
    createOrganization(organization: $organization) {
      _id
      name
      slug
    }
  }
`;

function valid(org) {
  return org.name && org.slug;
}

export default function OrganizationNew() {
  const history = useHistory();
  const [organization, setOrg] = useSimpleReducer({ name: '', slug: '' });
  const [createOrg, { data }] = useMutation(CREATE_ORG);

  useEffect(() => {
    if (data) history.push(`/admin/${organization.slug}`);
  }, [data]);

  const submit = () => {
    if (valid(organization)) {
      createOrg({ variables: { organization }, onCompleted: toast.success('Success!') });
    }
  };

  return (
    <Paper>
      <div className="OrganizationNew">
        <Grid>
          <Typography variant="h6" style={{ paddingLeft: '16px', paddingTop: '16px' }} gutterBottom>
            New Organization
          </Typography>
          <Grid style={{ padding: '16px' }}>
            <Grid style={{ paddingBottom: '16px' }}>
              <TextField
                style={{ width: '100%' }}
                value={organization.name}
                onChange={(e) => setOrg({ name: e.target.value })}
                label="Organization Name"
                variant="outlined"
              />
            </Grid>
            <Grid style={{ paddingBottom: '16px' }}>
              <TextField
                style={{ width: '100%', marginBottom: '15px' }}
                value={organization.slug}
                onChange={(e) => setOrg({ slug: e.target.value.replace(' ', '') })}
                label="URL (no spaces)"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <LogoUpload organization={organization} setOrg={setOrg} />
        </Grid>
        <Grid style={{ padding: '16px' }}>
          <Button variant="contained" color="primary" disabled={!valid(organization)} onClick={submit}>
            CREATE
          </Button>
        </Grid>
      </div>
    </Paper>
  );
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

function LogoUpload({ organization, setOrg }) {
  if (organization.logo) {
    return (
      <Grid style={{ padding: '16px' }}>
        <span className="file-label">Logo &nbsp;&nbsp;</span>
        <FontAwesomeIcon icon="check" />
      </Grid>
    );
  }

  return (
    <Grid style={{ padding: '16px' }}>
      <span className="file-label">Logo (3:1 width to height) &nbsp;&nbsp;</span>
      <Button variant="contained" component="label">
        Upload&nbsp;&nbsp;
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={({ target }) => {
            if (target.validity.valid) setOrg({ logo: target.files[0] });
          }}
        />
      </Button>
    </Grid>
  );
}
