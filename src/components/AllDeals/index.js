import React, { useEffect, useReducer, Fragment, useState } from 'react';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import { Row, Col } from 'reactstrap';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Button,
  LinearProgress,
  Typography,
  Grid,
  Hidden,
} from '@material-ui/core';
import Loader from '../utils/Loader';
import CapitalAccount from './CapitalAccount';

import { nWithCommas, formatDate } from '../../utils/numbers';

import useStyles from './styles';

/** *
 *
 * Fund manager's table view of all of their deals with capital accounts
 * view when clicked
 *
 * */
const OFFSET = 10;
const LIMIT = 10;

const GET_DEALS = gql`
  query GetOrg($slug: String!, $offset: Int, $limit: Int, $status: String) {
    organization(slug: $slug, offset: $offset, limit: $limit) {
      _id
      n_deals
      deals(offset: $offset, limit: $limit, status: $status) {
        _id
        status
        amount_raised
        target
        company_name
        company_description
        pledge_link
        onboarding_link
        date_closed
        dealParams {
          wireDeadline
        }
        deal_lead
        investments {
          _id
          amount
          status
          metaData
          investor {
            _id
            name
            investingAs
          }
        }
      }
    }
  }
`;

function DealProgress({ deal }) {
  const raised = _.sumBy(deal?.investments, 'amount');
  const progress = ((raised || 0) / (deal.target || Infinity)) * 100;
  return (
    <TableCell>
      <LinearProgress
        style={{ height: '20px' }}
        variant="determinate"
        color="secondary"
        value={progress}
      />
      <div className="text-center">
        ${nWithCommas(raised)} of ${nWithCommas(deal.target)}
      </div>
    </TableCell>
  );
}

export default function Deals({ showClosed }) {
  const styles = useStyles();
  const { organization } = useParams();
  const [page, setPage] = useState(0);

  const [getDeals, { data, error }] = useLazyQuery(GET_DEALS, {
    variables: { slug: organization, offset: 0, limit: LIMIT, status: showClosed ? 'closed' : '' },
  });
  const [capitalAccount, toggleCapitalAccount] = useReducer(
    (acc, _id) => {
      return acc === _id ? null : _id;
    },
    '5e553fb7e165e6d78c794097', // TODO: Remove this
  );
  const useInvestingAs = organization === 'irishangels';

  useEffect(() => {
    getDeals({
      variables: {
        offset: page * 10,
        limit: LIMIT,
      },
    });
  }, [getDeals, page]);

  if (error) return <div>{error.message}</div>;

  if (!data)
    return (
      <div>
        <Loader />
      </div>
    );

  const {
    organization: { deals },
  } = data;
  const { open, closed } = _.groupBy(deals, (d) => (d.status === 'closed' ? 'closed' : 'open'));

  const maxPages = Math.ceil(data.organization.n_deals / OFFSET);
  return (
    <div>
      {!showClosed && (
        <Row>
          <Col sm={{ size: 12 }}>
            <Paper className={styles.dealData}>
              <Button variant="contained" color="secondary">
                <Link to={`/admin/${organization}/deal/new`}>Create New Deal</Link>
              </Button>
            </Paper>
          </Col>
        </Row>
      )}
      {!showClosed && (
        <>
          <h5>
            Open Deals <span className={styles.dealsLength}>{(open || []).length}</span>
          </h5>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.th}>Deal</TableCell>
                  <TableCell className={styles.th}>Description</TableCell>
                  <Hidden only="xs">
                    <TableCell className={styles.th}>Closing</TableCell>
                  </Hidden>
                  <TableCell className={styles.th}>Lead</TableCell>
                  <Hidden only="xs">
                    <TableCell className={styles.th}>Progress</TableCell>
                  </Hidden>
                  <TableCell className={styles.th} />
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(
                  open,
                  (d) => new Date(d.dealParams.wireDeadline || Date.now()),
                  'desc',
                ).map((deal) => (
                  <TableRow key={deal._id}>
                    <TableCell>{deal.company_name}</TableCell>
                    <TableCell>{deal.company_description}</TableCell>
                    <Hidden only="xs">
                      <TableCell>{deal.dealParams.wireDeadline}</TableCell>
                    </Hidden>
                    <TableCell>{deal.deal_lead}</TableCell>
                    <Hidden only="xs">
                      <DealProgress deal={deal} />
                    </Hidden>
                    <TableCell align="center">
                      <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
      <>
        <Paper className={styles.closedDealsPaper}>
          <Grid container className={styles.closedDealsGrid}>
            <Typography variant="h6" gutterBottom>
              Closed Deals: {data?.organization?.n_deals}
            </Typography>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.th}>Deal</TableCell>
                <TableCell className={styles.th}>Description</TableCell>
                <TableCell className={styles.th}>Lead</TableCell>
                <Hidden only="xs">
                  <TableCell>Closed</TableCell>
                  <TableCell className={styles.th}>Size</TableCell>
                  <TableCell className={styles.th} align="center">
                    Investors
                  </TableCell>
                  <TableCell className={styles.th} />
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(
                closed,
                (d) => new Date(d.dealParams.wireDeadline || Date.now()),
                'desc',
              ).map((deal) => {
                let investments = _.orderBy(
                  _.reject(deal.investments, (i) => i.status === 'invited'),
                  'amount',
                  'desc',
                );
                if (useInvestingAs) {
                  investments = _.uniqBy(investments, 'investor.investingAs');
                }
                const totalRaised = _.sumBy(investments, 'amount');
                const groupedInvestments = _.groupBy(investments, 'metaData.group');
                return (
                  <Fragment key={deal._id}>
                    <TableRow
                      onClick={() => toggleCapitalAccount(deal._id)}
                      className={styles.closedDealRow}
                    >
                      <TableCell>{deal.company_name}</TableCell>
                      <TableCell>{deal.company_description}</TableCell>
                      <TableCell>{deal.deal_lead}</TableCell>
                      <Hidden only="xs">
                        <TableCell>{formatDate(deal.dealParams.wireDeadline)}</TableCell>
                        <TableCell>${nWithCommas(totalRaised)}</TableCell>
                        <TableCell align="center">{deal.investments.length}</TableCell>
                        <TableCell align="center">
                          <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
                        </TableCell>
                      </Hidden>
                    </TableRow>
                    {capitalAccount === deal._id && (
                      <>
                        {' '}
                        {_.map(groupedInvestments, (invs) => (
                          <CapitalAccount
                            deal={deal}
                            investments={invs}
                            totalRaised={totalRaised}
                            useInvestingAs={useInvestingAs}
                          />
                        ))}
                      </>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
          <Grid className={styles.paginationGrid}>
            <Button
              color="primary"
              variant="contained"
              className={styles.prevButton}
              onClick={() => {
                setPage(page - 1);
              }}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Typography className={styles.paginationText}>
              {page + 1} / {maxPages}
            </Typography>
            <Button
              color="primary"
              variant="contained"
              className={styles.nextButton}
              onClick={() => {
                setPage(page + 1);
              }}
              disabled={page + 1 >= maxPages}
            >
              Next
            </Button>
          </Grid>
        </Paper>
      </>
    </div>
  );
}
