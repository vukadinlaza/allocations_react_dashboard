import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import {
  Paper,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  LinearProgress,
  Grid,
  Hidden,
} from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Loader from '../../../utils/Loader';
import { nWithCommas } from '../../../../utils/numbers';
import InvestmentFlow from './investment-flow';
import Document from '../../../utils/Document';

/** *
 *
 * AdminHome is the overview of all a funds deals, investors, investments
 * looks similar to the investor home page but for fund admins
 *
 * */

export const ActiveDeals = ({ orgData, isDemo, superadmin }) => {
  const history = useHistory();

  if (!orgData) return <Loader />;

  const { active } = _.groupBy(orgData.deals, (d) => (d.status === 'closed' ? 'closed' : 'active'));
  const sortActive = (active || []).sort(
    (a, b) => new Date(b?.dealParams?.wireDeadline) - new Date(a?.dealParams?.wireDeadline),
  );
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <Grid container xs={12} justify="space-between" style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Active Deals: {(active || []).length}
            </Typography>
            <Button color="primary" variant="contained" onClick={() => history.push(`/admin/${orgData.slug}/deal/new`)}>
              Create Deal
            </Button>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <Hidden only="xs">
                  <TableCell>Closes</TableCell>
                </Hidden>
                <Hidden only="xs">
                  <TableCell>Progress</TableCell>
                  <TableCell />
                </Hidden>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {(sortActive || []).map((deal, index) => (
                <Deal
                  key={deal._id}
                  deal={deal}
                  index={index}
                  slug={orgData.slug}
                  isDemo={isDemo}
                  superadmin={superadmin}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

// clicking on the whole row opens the investment board
export const Deal = ({ deal, index, superadmin, slug, isDemo }) => {
  const history = useHistory();
  const { organization } = useParams();
  const [activeDeal, setActiveDeal] = useState();
  let raised = deal?.raised;
  if (slug === 'vitalize') {
    raised = _.sumBy(_.uniqBy(deal.investments, 'investor.investingAs'), 'amount');
  }
  const val = (Number(raised) / (Number(deal.target) || Number(raised))) * 100;
  const formattedDate_closed = moment(deal?.dealParams?.wireDeadline).format('Do MMMM YYYY');
  useEffect(() => {
    if (index === 0) {
      setActiveDeal(deal);
    }
  }, [deal, index]);
  return (
    <>
      <TableRow hover onClick={() => setActiveDeal(activeDeal ? false : deal)}>
        <TableCell>
          <strong>{deal.company_name}</strong>
        </TableCell>
        <Hidden only="xs">
          <TableCell>{formattedDate_closed || 'TBD'}</TableCell>
        </Hidden>
        <Hidden only="xs">
          <TableCell>
            <div>{Math.round(val || 0)}%</div>
            <LinearProgress className="deal-progress" variant="determinate" color="secondary" value={val} />
            <div>
              ${nWithCommas(raised)} of ${nWithCommas(deal.target || raised)}
            </div>
          </TableCell>
          <TableCell />
        </Hidden>
        <TableCell style={{ textAlign: 'right' }}>
          <>
            <Button
              color="primary"
              style={{ textTransform: 'lowercase' }}
              onClick={() => history.push(`/admin/${organization || deal.organization.slug}/deals/${deal._id}/edit`)}
            >
              Edit
            </Button>
            <Button
              color="primary"
              style={{ textTransform: 'lowercase' }}
              onClick={() => history.push(deal.appLink || '#')}
            >
              View
            </Button>
          </>
          <IconButton>{activeDeal ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </TableCell>
      </TableRow>
      {activeDeal && (
        <>
          {superadmin && deal?.documents?.length >= 1 && (
            <TableRow>
              <TableCell colspan="5">
                <Grid container sm={12} md={12} lg={12}>
                  {deal?.documents.map((doc) => {
                    return (
                      <Grid item xs={3} sm={3} md={3} lg={3}>
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
                            <img src="https://allocations-public.s3.us-east-2.amazonaws.com/file-icon.svg" />
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
              </TableCell>
            </TableRow>
          )}
          <TableRow style={{ borderTop: '0', maxWidth: '300px' }}>
            <TableCell colspan="5">
              <InvestmentFlow dealId={deal._id} isDemo={isDemo} superadmin={superadmin} />
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};
