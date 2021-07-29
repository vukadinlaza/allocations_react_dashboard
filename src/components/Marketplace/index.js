import React, { useEffect } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor'; // import the script
import { withStyles } from '@material-ui/core/styles';
import { useMutation, gql } from '@apollo/client';
import ChevronRight from '@material-ui/icons/ChevronRight';

import {
  Grid,
  Button,
  Typography,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Hidden,
} from '@material-ui/core';
import { useSimpleReducer, useFetch } from '../../utils/hooks';

import './style.scss';

/** *
 *
 * Marketplace
 *
 * */
const MARKETPLACE_LIKE = gql`
  mutation CreateMarketplaceLike($like: MarketplaceLikeInput!) {
    createMarketplaceLike(like: $like) {
      name
      round
    }
  }
`;

const BASE = 'appI9kFJSiLbjnGl3';
const TABEL_NAME = 'Marketplace';
export default function Marketplace() {
  const { data } = useFetch(BASE, TABEL_NAME);
  const [marketplaceLike, setMarketplaceLike] = useSimpleReducer({
    name: '',
    round: '',
    closeDate: '',
  });
  const [createMarketplaceLike] = useMutation(MARKETPLACE_LIKE, {
    onCompleted: () => {
      setMarketplaceLike({ showLoading: true });
    },
  });
  useEffect(() => {
    if (marketplaceLike.showLoading) {
      setTimeout(() => {
        setMarketplaceLike({ showFinal: true });
      }, 3000);
    }
  }, [setMarketplaceLike, marketplaceLike.showLoading]);

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 400,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
  if (!data) return null;

  const deals = data
    .map((r) => r.fields)
    .filter((d) => {
      return d[`Deal Name`];
    })
    .sort(
      (a, b) =>
        _.toNumber(b.pledged?.replaceAll(/[, $]/g, '')) -
        _.toNumber(a.pledged?.replaceAll(/[, $]/g, '')),
    );

  return (
    <div className="blue-container">
      <Grid>
        <h4 style={{ color: '#fff ' }}>Top Deals by Pledges</h4>
        <h6 style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.65rem' }}>
          Allocations is not affiliated with, sponsors, or endorses any of the companies listed on
          this site. Content on this page is provided for informational purposes only, may not
          reflect the most current data, and should not be relied upon. You should do your own due
          diligence when making any investment in a company listed on this site. The order in which
          companies are displayed on this site does not imply any endorsement or recommendation, but
          simply a categorization based upon the characteristics of the offering (e.g. amount
          pledged).
        </h6>
      </Grid>
      <Grid
        container
        xs={12}
        sm={12}
        md={12}
        lg={12}
        justify="space-between"
        style={{
          marginTop: '40px',
          marginBottom: '1rem',
          borderRadius: '8px',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 1)',
        }}
      >
        <Grid
          xs={12}
          sm={12}
          md={1}
          lg={1}
          style={{ justifyContent: 'center', alignContent: 'center', padding: '0.5rem' }}
        />

        {/* ITEM  - NAME */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={12}
            md={2}
            lg={2}
            style={{ justifyContent: 'center', alignContent: 'center', paddingRight: '15px' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Deal Name
            </Typography>
          </Grid>
        </Hidden>

        {/* ITEM - Pleadged Title */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={12}
            md={1}
            lg={1}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Pledged
            </Typography>
          </Grid>
        </Hidden>

        {/* ITEM - Deal Lead */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={12}
            md={1}
            lg={1}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Deal Lead
            </Typography>
          </Grid>
        </Hidden>

        {/* ITEM - Personal Investment Amount */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={1}
            md={1}
            lg={1}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Est. Personal Investment
            </Typography>
          </Grid>
        </Hidden>

        {/* ITEM - Co-Investors */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={12}
            md={2}
            lg={2}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Co-Investors
            </Typography>
          </Grid>
        </Hidden>

        {/* ITEM - Closing Date */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={12}
            md={1}
            lg={1}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Closing Date
            </Typography>
          </Grid>
        </Hidden>

        {/* ITEM - BLANK */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={1}
            md={1}
            lg={1}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            />
          </Grid>
        </Hidden>

        {/* ITEM - BLANK */}
        <Hidden only="xs">
          <Grid
            xs={12}
            sm={12}
            md={1}
            lg={1}
            style={{ justifyContent: 'center', alignContent: 'center' }}
          >
            <Typography
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            />
          </Grid>
        </Hidden>

        {/*  Start looping through deals */}
        {deals.map((deal) => {
          const {
            close_date,
            coinvestors,
            deal_lead,
            deal_tagline,
            est_personal_investment,
            highlight_1,
            highlight_2,
            highlight_3,
            logo_link,
            pledged,
            round,
            to,
          } = deal;

          return (
            <Grid container style={{ background: 'rgba(255, 255, 255, 1)' }}>
              {/* Row 1 */}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  height: 'auto',
                  display: 'flex',
                  paddingLeft: '0.1rem',
                  paddingRight: '0.1rem',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  paddingBottom: '0.5rem',
                  paddingTop: '0.75rem',
                  marginBottom: '0rem',
                  marginTop: '0rem',
                  borderBottom: 'solid 0.25px rgba(0, 0, 0, 0.25)',
                  // boxShadow: '0 4px 2px -2px gray',
                }}
              >
                {/* ITEM 1 - LOGO */}
                <Grid
                  xs={2}
                  sm={1}
                  md={1}
                  lg={1}
                  style={{ justifyContent: 'center', alignContent: 'center', padding: '0.5rem' }}
                >
                  <img src={logo_link} alt="oops" style={{ width: '100%', height: 'auto' }} />
                </Grid>

                {/* ITEM 2 - NAME */}
                <HtmlTooltip
                  title={
                    <>
                      <Typography color="inherit">Highlights</Typography>
                      <div>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <ChevronRight />
                            </ListItemIcon>
                            <ListItemText primary={highlight_1} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <ChevronRight />
                            </ListItemIcon>
                            <ListItemText primary={highlight_2} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <ChevronRight />
                            </ListItemIcon>
                            <ListItemText primary={highlight_3} />
                          </ListItem>
                        </List>
                      </div>
                    </>
                  }
                >
                  <Grid
                    xs={6}
                    sm={3}
                    md={2}
                    lg={2}
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      paddingRight: '15px',
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: '1.1rem',
                        color: 'rgba(0,0,0,0.8)',
                        padding: '0px',
                      }}
                    >
                      {deal['Deal Name']}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '0.75rem',
                        color: 'rgba(0,0,0,0.5)',
                        padding: '0px',
                      }}
                    >
                      {deal_tagline}
                    </Typography>
                  </Grid>
                </HtmlTooltip>

                {/* ITEM 5 */}
                <Hidden only="xs">
                  <Grid
                    xs={12}
                    sm={12}
                    md={1}
                    lg={1}
                    style={{ justifyContent: 'center', alignContent: 'around', padding: '0px' }}
                  >
                    <a href={to} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick=""
                        style={{ justifyContent: 'center', alignContent: 'center' }}
                      >
                        {pledged}
                      </Button>
                    </a>
                  </Grid>
                </Hidden>

                {/* ITEM 4 */}
                <Hidden only="xs">
                  <Grid
                    xs={12}
                    sm={1}
                    md={1}
                    lg={1}
                    style={{ justifyContent: 'center', alignContent: 'center' }}
                  >
                    <Typography
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.9)',
                        paddingTop: '0px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: randomColor({ hue: 'blue', luminosity: 'bright' }),
                          maxWidth: 'fit-content',
                          borderRadius: '.5rem',
                          textAlign: 'center',
                          minWidth: '90px',
                        }}
                      >
                        {deal_lead}
                      </div>
                    </Typography>
                  </Grid>
                </Hidden>

                {/* ITEM 3 Personal Investment Amount */}
                <Hidden only="xs">
                  <Grid
                    xs={12}
                    sm={1}
                    md={1}
                    lg={1}
                    style={{ justifyContent: 'center', alignContent: 'center' }}
                  >
                    <Typography
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(0,0,0,0.8)',
                        padding: '0px',
                      }}
                    >
                      {est_personal_investment}
                    </Typography>
                  </Grid>
                </Hidden>

                {/* ITEM 6 */}
                <Hidden only="xs">
                  <Grid
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    style={{ justifyContent: 'center', alignContent: 'center' }}
                  >
                    <Typography
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(0,0,0,0.8)',
                        padding: '0px',
                      }}
                    >
                      {coinvestors}
                    </Typography>
                  </Grid>
                </Hidden>

                {/* ITEM 6 */}
                <Hidden only="xs">
                  <Grid
                    xs={12}
                    sm={12}
                    md={1}
                    lg={1}
                    style={{ justifyContent: 'center', alignContent: 'center' }}
                  >
                    <Typography
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(0,0,0,0.8)',
                        padding: '0px',
                      }}
                    >
                      {close_date}
                    </Typography>
                  </Grid>
                </Hidden>

                {/* ITEM 7 */}

                <Grid
                  xs={4}
                  sm={1}
                  md={1}
                  lg={1}
                  style={{ justifyContent: 'center', alignContent: 'around', padding: '0.5rem' }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ marginBottom: '5px' }}
                    onClick={() => {
                      createMarketplaceLike({
                        variables: {
                          like: {
                            name: deal['Deal Name'] || '',
                            round: round[0] || '',
                          },
                          onCompleted: toast.success('Success!'),
                        },
                      });
                    }}
                  >
                    REQUEST INVITE
                  </Button>
                </Grid>

                {/* ITEM 8 */}

                <Hidden only="xs">
                  <Grid
                    xs={3}
                    sm={1}
                    md={1}
                    lg={1}
                    style={{ justifyContent: 'center', alignContent: 'around', padding: '0.5rem' }}
                  >
                    <a href={to} target="_blank" rel="noopener noreferrer">
                      <Button variant="contained" color="primary" size="small" onClick="">
                        PLEDGE
                      </Button>
                    </a>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
