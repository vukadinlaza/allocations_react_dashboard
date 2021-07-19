import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useParams, Link, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../utils/Loader';
import { nWithCommas, formatDate } from '../../utils/numbers';
import { useAuth } from '../../auth/useAuth';

/** *
 *
 * Investments table for fund admin/superadmin
 *
 * */

const GET_INVESTMENTS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      investments {
        _id
        status
        amount
        deal {
          _id
          company_name
          company_description
          date_closed
          slug
          dealParams {
            wireDeadline
          }
        }
        documents {
          path
          link
        }
        investor {
          _id
          name
          first_name
          last_name
          investor_type
          entity_name
          email
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  green: {
    color: theme.palette.secondary.main,
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

export default function Investments() {
  const { organization } = useParams();
  const [showDocs, setShowDocs] = useState(null);
  const history = useHistory();
  const classes = useStyles();

  const { userProfile } = useAuth();
  const [getInvestments, { data, error }] = useLazyQuery(GET_INVESTMENTS);

  useEffect(() => {
    if (userProfile && userProfile.email) getInvestments({ variables: { slug: organization } });
  }, [userProfile]);

  if (error) return <div>{error.message}</div>;

  if (!data)
    return (
      <div>
        <Loader />
      </div>
    );

  const investments = _.orderBy(
    _.get(data, 'organization.investments', []),
    (i) => new Date(i.deal.dealParams.wireDeadline).getTime(),
    'desc',
  );
  if (showDocs) {
    investments.splice(investments.findIndex((i) => i._id === showDocs._id) + 1, 0, { showDocs });
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h6" gutterBottom>
              Total Invested: <span className={classes.green}>${nWithCommas(_.sumBy(investments, 'amount'))}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => history.push(`/admin/investment/new`)}>
              Add Investment
            </Button>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Investor</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Closing Date</TableCell>
              <TableCell align="right">Docs</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {investments.map((investment) =>
              investment.showDocs ? (
                <DocsRow key={showDocs._id} docs={showDocs.documents} />
              ) : (
                <TableRow key={investment._id} className="investment-row">
                  <TableCell>{_.get(investment, 'investor.email')}</TableCell>
                  <TableCell scope="row">{investment.deal.company_name}</TableCell>
                  <TableCell>{investment.deal.company_description}</TableCell>
                  <TableCell align="right">
                    {investment.amount ? `$${nWithCommas(investment.amount)}` : 'TBD'}
                  </TableCell>
                  <TableCell>
                    <span className={`investment-status investment-status-${investment.status}`}>
                      {investment.status}
                    </span>
                  </TableCell>
                  <TableCell align="center">{formatDate(investment.deal.dealParams.wireDeadline)}</TableCell>
                  <TableCell align="right">
                    {_.get(investment, 'documents.length', 0) > 0 ? (
                      showDocs && showDocs._id === investment._id ? (
                        <FontAwesomeIcon icon="times" onClick={() => setShowDocs(null)} />
                      ) : (
                        <FontAwesomeIcon icon="info-circle" onClick={() => setShowDocs(investment)} />
                      )
                    ) : (
                      ''
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/admin/${organization}/investments/${investment._id}/edit`}>edit</Link>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

function filename(path) {
  try {
    return path.split('/')[2];
  } catch {
    return path;
  }
}

function DocsRow({ docs }) {
  return (
    <TableRow>
      <TableCell colSpan={7}>
        {docs.map((doc) => (
          <div key={doc?.link} className="doc-wrapper">
            <div className="doc">
              <FontAwesomeIcon icon={['far', 'file-pdf']} />
            </div>
            <div className="filename">
              <span>
                <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
                  {filename(doc.path)}
                </a>
              </span>
            </div>
          </div>
        ))}
      </TableCell>
    </TableRow>
  );
}
