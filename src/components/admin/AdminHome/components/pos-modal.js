import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useLazyQuery, gql } from '@apollo/client';
import { Modal, Grid, TextField, Typography, Paper, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';

import Loader from '../../../utils/Loader';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    border: '1px solid #000',
    backgroundColor: '#f9fbfb',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    marginTop: '3vh',
    maxHeight: '95vh',
    overflow: 'scroll',
  },
  button: {
    backgroundColor: '#00A0C6',
    align: 'center',
    marginTop: '1rem',
  },
  header: {
    align: 'center',
  },
  subtext: {
    marginBottom: '.5rem',
  },
}));
const GET_DOCUSIGN_FORM = gql`
  query GetDocusignForm($data: Object!) {
    getLink(input: $data)
  }
`;

const POSModal = ({ modal, setModal, organization }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [link, setLink] = useState({});
  const [getLink, { loading, data }] = useLazyQuery(GET_DOCUSIGN_FORM);

  useEffect(() => {
    if (organization) {
      setFormData({ organization_name: organization.name });
    }
  }, [organization]);

  useEffect(() => {
    if (data?.getLink?.redirectUrl && !loading) {
      setLink(data?.getLink);
    }
  }, [data, loading, setLink]);

  const inputs = [
    { tabLabel: 'Organization-Name', label: 'Organization Name', slug: 'organization_name' },
    { tabLabel: 'Full-Name', label: 'Signer Name', slug: 'signer_full_name' },
  ];

  const handleChange = (prop) => (e) => {
    e.persist();
    return setFormData((prev) => ({ ...prev, [prop]: e.target.value }));
  };
  const submit = () =>
    getLink({ variables: { data: { ...formData, documentType: 'Provision Of Services' } } });
  const { redirectUrl, formName } = link;

  return (
    <Modal
      open={modal}
      onClose={() => setModal(false)}
      aria-labelledby="pos-modal"
      aria-describedby="pos-modal"
    >
      <Grid container xs={12} justify="center" alignItems="center">
        <Paper className={classes.paper}>
          <FontAwesomeIcon icon="times" pull="right" border onClick={() => setModal(false)} />

          {!redirectUrl && (
            <>
              <Typography variant="h5" align="center" className={classes.header}>
                Organization Information
              </Typography>

              {loading ? (
                <Loader />
              ) : (
                <>
                  <Typography variant="subtitle2" align="center" className={classes.subtext}>
                    This information will be used to fill out Allocation's Provision Of Services
                    Agreement.
                  </Typography>
                  <Grid container spacing={2}>
                    {inputs.map((item) => {
                      return (
                        <Grid item xs={12} sm={12} md={6}>
                          <TextField
                            required
                            style={{ width: '100%' }}
                            value={get(formData, item.slug) || ''}
                            onChange={handleChange(item.slug)}
                            label={item.label}
                            variant="outlined"
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Grid container justify="center">
                    <Button onClick={submit} variant="contained" className={classes.button}>
                      Next
                    </Button>
                  </Grid>
                </>
              )}
            </>
          )}

          {redirectUrl && !loading && (
            <>
              <div className="external-sign-link">
                <Typography variant="h5" align="center">
                  {formName}
                </Typography>
                <a href={redirectUrl} target="_blank" rel="noopener noreferrer center" />
              </div>
              <div className="embed-responsive embed-responsive-1by1">
                <iframe
                  className="embed-responsive-item"
                  title="Wire Instructions"
                  src={redirectUrl}
                />
              </div>
            </>
          )}
        </Paper>
      </Grid>
    </Modal>
  );
};

export default POSModal;
