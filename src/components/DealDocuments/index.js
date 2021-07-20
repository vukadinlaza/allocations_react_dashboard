import React, { useEffect, useState } from 'react';
import { map } from 'lodash';
import { useMutation, useQuery, gql } from '@apollo/client';
import {
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      organizations_admin {
        _id
        deals {
          _id
          company_name
          documents {
            link
            path
          }
        }
      }
    }
  }
`;

const ADD_DOC = gql`
  mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
    addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
      _id
      company_name
      documents {
        link
        path
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '75%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
}));

function DealDocuments() {
  const [docs, setDocs] = useState([]);
  const [deal, setDeal] = useState();
  const { data: userData, refetch } = useQuery(GET_INVESTOR);
  const [addDoc, { data, loading }] = useMutation(ADD_DOC);
  const classes = useStyles();
  const submit = async () => {
    if (docs.length === 0) return null;
    const d = await map(docs, (doc) => {
      return addDoc({
        variables: {
          deal_id: deal._id,
          title: `s-${doc.name}`,
          doc,
        },
      });
    });
    refetch();
  };

  useEffect(() => {
    if (data?.addDealDoc) {
      setDeal(data?.addDealDoc);
      setDocs([]);
    }
  }, [loading]);

  if (!userData?.investor) return null;
  const deals = userData?.investor?.organizations_admin.reduce((acc, org) => {
    return [...acc, ...org.deals];
  }, []);
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h4">Supplemental Files</Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Deal</InputLabel>
              <Select value={deal?.company_name} onChange={(e) => setDeal(e.target.value)}>
                {(deals || []).map((d) => (
                  <MenuItem value={d}>{d?.company_name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid item style={{ minWidth: '75%' }}>
              {!docs.length >= 1 && (
                <Button
                  disabled={!deal}
                  fullWidth
                  variant="contained"
                  component="label"
                  style={{ height: 39 }}
                >
                  Attach
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    multiple
                    onChange={({ target }) => {
                      if (target.validity.valid) setDocs(target.files);
                    }}
                  />
                </Button>
              )}
            </Grid>
            <Grid container>
              {map(docs, (doc) => (
                <Grid lg={6} md={6} xs={12}>
                  <Paper
                    style={{
                      margin: '.5rem',
                      flexDirection: 'column',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '.5rem',
                      minHeight: '8rem',
                      borderRadius: '1rem',
                    }}
                  >
                    <img
                      src="https://allocations-public.s3.us-east-2.amazonaws.com/file-icon.svg"
                      alt="File Icon"
                    />
                    <Typography
                      variant="body2"
                      style={{
                        wordBreak: 'break-all',
                        fontSize: '.7rem',
                        paddingLeft: '.75rem',
                        paddingRight: '.75rem',
                      }}
                    >
                      <span style={{ color: 'blue' }}>{doc.name}</span>
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid item style={{ minWidth: '75%', marginTop: '1rem' }}>
              <Button
                variant="contained"
                onClick={submit}
                style={{ height: 39, minWidth: '75%' }}
                fullWidth
                color="primary"
              >
                Upload
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Grid container>
              {map(deal?.documents, (doc) => {
                return (
                  <Grid lg={6} md={6} xs={12}>
                    <a href={`https://${doc?.link}`} target="_blank" rel="noopener noreferrer">
                      <Paper
                        style={{
                          margin: '.5rem',
                          flexDirection: 'column',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: '.5rem',
                          minHeight: '8rem',
                          borderRadius: '1rem',
                        }}
                      >
                        <img
                          src="https://allocations-public.s3.us-east-2.amazonaws.com/file-icon.svg"
                          alt="File Icon"
                        />
                        <Typography
                          variant="body2"
                          style={{
                            wordBreak: 'break-all',
                            fontSize: '.7rem',
                            paddingLeft: '.75rem',
                            paddingRight: '.75rem',
                          }}
                        >
                          <span style={{ color: 'blue' }}>{doc.path}</span>
                        </Typography>
                      </Paper>
                    </a>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default DealDocuments;
