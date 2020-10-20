import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/react-hooks';
import { Hidden, Paper, ListItem, List, Grid, Button, Typography } from '@material-ui/core';
import { useSimpleReducer } from '../../utils/hooks';
import { useAuth } from '../../auth/useAuth';
import './style.scss';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      name
      first_name
      last_name
      entity_name
      country
      signer_full_name
      accredited_investor_status
      investor_type
      email
      organizations
      admin
      investments {
        _id
        value
        amount
        status
        created_at
        documents {
          path
          link
        }
        deal {
          _id
          slug
          company_name
          company_description
          date_closed
          status
          appLink
          dealParams {
            dealMultiple
            wireDeadline
          }
          organization {
            _id
            slug
          }
        }
      }
    }
  }
`;

/** *
 *
 * Marketplace
 *
 * */
const MARKETPLACE_LIKE = gql`
  mutation CreateMarketplaceLike($like: MarketplaceLikeInput!) {
    createMarketplaceLike(like: $like) {
      name
    }
  }
`;

export default function Marketplace() {
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

  const { userProfile } = useAuth(GET_INVESTOR);

  const deals = [
    {
      to: '/axiom-space',
      name: 'Axiom Space',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/axiom_space.png',
      sharePrice: '50',
      round: 'Series B',
      lastRoundDate: '06/30/2020',
      valuation: '$650M',
      allocation: '10,000,000',
      percentDifference: '3.55',
      fees: '$0',
      closeDate: '11/10/2020',
    },
    {
      to: '/brex',
      name: 'Brex',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/brex.png',
      sharePrice: '30',
      round: 'Series A',
      lastRoundDate: '5/12/2020',
      valuation: '$2.6B',
      allocation: '10,000',
      percentDifference: '4.65',
      fees: '0',
      closeDate: '11/11/2020',
    },
    {
      to: '/juvenescence',
      name: 'Juvenescence',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/juvenescence.png',
      sharePrice: '55',
      round: 'Series D',
      lastRoundDate: '3/12/2020',
      valuation: '3.05B',
      allocation: '25,000',
      percentDifference: '13.05',
      fees: '0',
      closeDate: '12/31/2020',
    },
    {
      to: '/allocations',
      name: 'Allocations',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/allocations.png',
      sharePrice: '25',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '1.5M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/abra',
      name: 'Abra',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/abra.png',
      sharePrice: '45',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '1.5M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/assure',
      name: 'Assure',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/assure.png',
      sharePrice: '105',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '1.05M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/airbnb',
      name: 'Airbnb',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/air_bnb.png',
      sharePrice: '250',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '1.05M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/bakkt',
      name: 'Bakkt',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/bakkt.png',
      sharePrice: '15',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '2.35M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/wavebase',
      name: 'Wavebase',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/wavebase.png',
      sharePrice: '100',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '2.35M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/vectr',
      name: 'Vectr',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/vectr.png',
      sharePrice: '140',
      round: 'Series B',
      lastRoundDate: '7/12/2020',
      valuation: '1.05M',
      allocation: '5,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
    {
      to: '/spacex',
      name: 'SpaceX',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/spacex.png',
      sharePrice: '234',
      round: 'Series D',
      lastRoundDate: '7/12/2020',
      valuation: '2.15B',
      allocation: '15,000',
      percentDifference: '13.05',
      fees: '0',
      closeDate: '11/12/2020',
    },
    {
      to: '/pioneer-fund',
      name: 'Pioneer Fund',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/pioneer_fund.png',
      sharePrice: '120',
      round: 'Series C',
      lastRoundDate: '7/12/2020',
      valuation: '2.35M',
      allocation: '10,000',
      percentDifference: '3.05',
      fees: '0',
      closeDate: '10/31/2020',
    },
  ];

  return (
    <div className="blue-container">
      <Grid container spacing={12} justify="space-between" style={{ marginTop: '40px', marginBottom: '1rem' }}>
        {deals.map(
          ({
            to,
            name,
            logo,
            sharePrice,
            round,
            lastRoundDate,
            valuation,
            allocation,
            percentDifference,
            fees,
            closeDate,
          }) => (
            <Grid item xs={12} sm={12} md={4} style={{ border: '1em solid transparent' }}>
              <Paper style={{ minHeight: '100px' }}>
                <Grid container>
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
                      marginTop: '0.5rem',
                      borderBottom: 'solid 0.25px rgba(0, 0, 0, 0.25)',
                      boxShadow: '0 4px 2px -2px gray',
                    }}
                  >
                    <Grid
                      xs={6}
                      sm={4}
                      md={4}
                      lg={4}
                      style={{ justifyContent: 'center', alignContent: 'center', padding: '0.5rem' }}
                    >
                      <img src={logo} alt="oops" style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                    <Grid xs={2} sm={5} md={5} lg={5}>
                      <Typography
                        style={{
                          fontSize: '1.1rem',
                          color: 'rgba(0,0,0,0.8)',
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(0,0,0,0.5)',
                        }}
                      >
                        This is a tagline
                      </Typography>
                    </Grid>
                    <Grid
                      xs={3}
                      sm={3}
                      md={3}
                      lg={3}
                      style={{ justifyContent: 'center', alignContent: 'center', padding: '0.5rem' }}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => {
                          createMarketplaceLike({
                            variables: {
                              like: {
                                name,
                                round,
                              },
                            },
                          });
                        }}
                      >
                        LIKE
                      </Button>
                    </Grid>
                  </Grid>

                  {/* GREY BACKGROUND */}
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ background: 'rgba(0, 0, 0, 0.01)' }}>
                    {/* Row 2 - Round, Last Round, Valuation */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{
                        display: 'flex',
                        paddingLeft: '0.1rem',
                        paddingRight: '0.1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.2rem',
                        justifyContent: 'start',
                        textAlign: 'left',
                        marginBottom: '0.25rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      <Grid xs={12} sm={12} md={12} lg={12}>
                        <ul>
                          <Typography
                            style={{
                              fontSize: '0.75rem',
                              color: 'rgba(0,0,0,0.5)',
                            }}
                          >
                            <li> This is a highlight about the deal</li>
                            <li> This is a highlight about the deal</li>
                            <li> This is a highlight about the deal</li>
                          </Typography>
                        </ul>
                      </Grid>
                    </Grid>
                    {/* Row 3 - Allocation, % */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{
                        display: 'flex',
                        paddingLeft: '0.1rem',
                        paddingRight: '0.1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.2rem',
                        justifyContent: 'space-between',
                        textAlign: 'center',
                        marginBottom: '0.25rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      <Grid xs={12} sm={4} md={4} lg={4}>
                        <Typography style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                          Pledged
                        </Typography>
                        <Typography style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.85)', fontWeight: '900' }}>
                          50%
                        </Typography>
                      </Grid>
                      <Grid xs={12} sm={4} md={4} lg={4}>
                        <Typography style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                          Investors
                        </Typography>
                        <Typography style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.85)', fontWeight: '900' }}>
                          67
                        </Typography>
                      </Grid>
                      <Grid xs={12} sm={4} md={4} lg={4}>
                        <Typography style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                          Days To Invest
                        </Typography>
                        <Typography style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.85)', fontWeight: '900' }}>
                          17 Days
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ),
        )}
      </Grid>
    </div>
  );
}
