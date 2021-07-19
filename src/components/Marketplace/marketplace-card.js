import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/client';
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
      to: 'https://docs.google.com/spreadsheets/d/1EJJgDbSm4pOPZ5zFkzek2atiYWAoYZTfZExakwppGxw/edit#gid=0',
      name: 'Sana Health',
      tagline: 'Neuromodulation technology to end chronic pain',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/sana-health.png',
      highlight_1: 'Scheduled to get FDA approval December 2020',
      highlight_2: 'Improved quality of life for 90% of subjects with fibromyalgia',
      highlight_3: '3x times reduction in pain level in a 75-person pain study ',
      pledged: '$505,000.00',
      deal_lead: 'Daniel Weiss Pick',
      closeDate: '10/31/2020',
      round: 'Third round',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1s_f6gMA5eGV-YIBAOoRpSB2u19KiHX2Ly4KdZn1vx0Y/edit#gid=0',
      name: 'Cognitive Space',
      tagline: 'Autonomous satellite systems',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/cognitive-space.png',
      highlight_1: 'AI-based constellation management software.',
      highlight_2: 'Secured Air Force grants and has several government partnerships in place',
      highlight_3: '6.5M valuation',
      pledged: '$60,000.00',
      deal_lead: 'Ryan Kriser',
      closeDate: '11/10/2020',
      round: 'Seed',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1EJCO1SURyv-rbnhoo9EbkR2mFydKfPBBgI2XYIVURDM/edit#gid=0',
      name: 'Luminous',
      tagline: 'Photonics chip company backed by Bill Gates',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/luminous.png',
      highlight_1: 'Photonics supercomputer moonshot to power AI computation at the speed of light',
      highlight_2: 'Claims it has solved the current bottleneck in moving data around',
      highlight_3: 'Single chip may replace 3000 TPU boards',
      pledged: '$69,000.00',
      deal_lead: 'Joshua Browder',
      closeDate: '10/31/2020',
      round: 'Secondary',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1w-rDxctNyycpcQBDi43-0VQglKvAlWJfqC7ETZz1EdM/edit#gid=0',
      name: 'Factmata',
      tagline: 'AI company for online content risk management',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/factmata.png',
      highlight_1: 'Combatting bots and fake news',
      highlight_2: '~£20-30k MRR revenue',
      highlight_3: 'Raising £1.5M at £5M pre-money valuation',
      pledged: '$2,000.00',
      deal_lead: 'Giacomo Marriotti',
      closeDate: '10/31/2020',
      round: 'Bridge to A',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1xKMQzP3mRvNLc6HsBiSFCDbxjoRASLVdgd7I4E6c2tQ/edit#gid=0',
      name: 'Brex',
      tagline: 'Corporate credit cards',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/brex.png',
      highlight_1: '$2.6B valuation',
      highlight_2: 'Financing alternatives for startups',
      highlight_3: 'Offers corporate credit cards and cash management accounts to tech companies',
      pledged: '$250,000.00',
      deal_lead: 'Kingsley Advani',
      closeDate: '10/31/2020',
      round: 'Secondary',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1A8kmlgjPoxtrlgdwUa6e5nY9bBisCjJBBi--Nc7JVa8/edit#gid=0',
      name: 'SpaceX',
      tagline: "The world's most famous private space company",
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/spacex.png',
      highlight_1: 'SpaceX is one of the largest players in the space launch industry',
      highlight_2: 'Currently deploying Starlink satellite internet network',
      highlight_3: '$46B valuation',
      pledged: '$162,000.00',
      deal_lead: 'Kingsley Advani',
      closeDate: '10/31/2020',
      round: 'Series N',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1ulnVK-O2lY3uGgOhc11rW0WDxcigONC858MLcCEPBG0/edit',
      name: 'Axiom Space',
      tagline: 'Building a commercial space station',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/axiom-space.png',
      highlight_1: 'Plans to replace the International Space Station',
      highlight_2: 'Revenue streams: space tourism, astronaut training and research',
      highlight_3: 'Valuation is estimated to be around $650M',
      pledged: '$0.00',
      deal_lead: 'Nicholas Shekerdemian',
      closeDate: '10/31/2020',
      round: 'Series B',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1ebS6A0bD8hb9RWpw94VLz_AVIQQByVTvUIEy2lAZKhs/edit#gid=0',
      name: 'On Deck',
      tagline: 'The first place the best talent looks when starting or joining a startup',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/runway_fund.png',
      highlight_1: 'This fund invests in the best early stage founders',
      highlight_2: '450 Fellows have so far started 160 companies',
      highlight_3: 'Raising a $5M fund, which invests in 80-100 companies over the next 12-18 months',
      pledged: '35000',
      deal_lead: 'Don Ho',
      closeDate: '10/31/2020',
      round: 'N/A',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1dlkEmnt7Ls9f5Pic7AgKSF4JwnZtVM3MreSgU1mm_VU/edit#gid=0',
      name: 'Venus Aerospace',
      tagline: 'Hypersonic travel',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/venus-aerospace.png',
      highlight_1: 'Hypersonic travel with novel detonation engine',
      highlight_2: 'Concept verified by NASA',
      highlight_3: 'The fastest way in history to get-door-to-door',
      pledged: '$22,000.00',
      deal_lead: 'Jai Malik',
      closeDate: '10/31/2020',
      round: 'Seed',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1o0joVOj-R-b5ZGZLyhIT3Ey-4bVQEOqZc0vwuVfk3IM/edit#gid=0',
      name: 'ArcType',
      tagline: 'Intuitive SQL client for developers and teams',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/arctype.png',
      highlight_1: '15m post-money valuation cap',
      highlight_2: 'Previous investors include Chamath Palihapitiya',
      highlight_3: ' Pre-revenue; 400+ signups and approx 50 WAUs',
      pledged: '$2,000.00',
      deal_lead: 'Jai Malik',
      closeDate: '10/31/2020',
      round: 'Pre-seed',
    },
    {
      to: 'https://docs.google.com/spreadsheets/u/2/d/1oI0TduSQcs2_Ya2ldbZ6rMZ2RbLE8h7StadJK-_E4c0/edit',
      name: 'Mati',
      tagline: 'Data infrastructure for the trust economy',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/mati-id.png',
      highlight_1: 'Mati aims to power 1 million Trust Economy companies by building the data infrastructure',
      highlight_2: '5.8x YoY revenue growth, $1.85M ARR',
      highlight_3: 'Raising an $8M Series A round at a $60M valuation',
      pledged: '$100,000.00',
      deal_lead: 'Tribe Capital',
      closeDate: '10/31/2020',
      round: 'Series A',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1EJJgDbSm4pOPZ5zFkzek2atiYWAoYZTfZExakwppGxw/edit#gid=0',
      name: 'Agronomics',
      tagline: 'Sustainable investment in clean meat',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/agronomics.png',
      highlight_1:
        'Environmentally friendly alternatives to the traditional production of meat and plant-based sources of nutrition',
      highlight_2: 'Portfolio companies include BlueNalu, New Age Meats, Shiok Meats and Legendairy',
      highlight_3: 'Agronomics wants to decrease the unsustainable demand on natural resources',
      pledged: '$5,000.00',
      deal_lead: 'Kingsley Advani',
      closeDate: '10/31/2020',
      round: 'N/A',
    },
    {
      to: 'https://docs.google.com/spreadsheets/d/1rYovX8o5OqW2u40QlIKH3vru9t0fXAhnBPgxXjeZ_xw/edit#gid=0',
      name: 'Cheqout',
      tagline: 'A QR payments company for brick-and-mortar transactions',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/cheqout.png',
      highlight_1: 'An Alipay for the US, CheqOut blends ordering and payments, with an initial focus on restaurants',
      highlight_2: 'Crossed $1M in processed payments last month, 3 months after launch',
      highlight_3: 'TAM is $800B in restaurant revenues, SOM is $170B in full service—CheqOut takes 1.8% of revenue',
      pledged: '$0.00',
      deal_lead: 'Jerry Chang',
      closeDate: '10/31/2020',
      round: 'Series A',
    },
    {
      to: '/sen',
      name: 'Sen',
      tagline: 'Real-time videos from space',
      logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/sen.png',
      highlight_1: 'Sen is ideally suited to win first mover advantage',
      highlight_2: 'Have been informally contacted by Elon Musk',
      highlight_3: 'Seed valuation: $15.71M, raising $4.19M',
      pledged: '0',
      deal_lead: 'Ryan Kriser',
      closeDate: '10/31/2020',
      round: 'Seed',
    },
  ];

  return (
    <div className="blue-container">
      <Grid>
        <h4 style={{ color: '#fff ' }}>Featured Deals</h4>
      </Grid>
      <Grid container spacing={12} justify="space-between" style={{ marginTop: '40px', marginBottom: '1rem' }}>
        {deals.map(
          ({
            to,
            name,
            tagline,
            highlight_1,
            highlight_2,
            highlight_3,
            logo,
            pledged,
            deal_lead,
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
                        {tagline}
                      </Typography>
                    </Grid>
                    <Grid
                      xs={3}
                      sm={3}
                      md={3}
                      lg={3}
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
                                name,
                                round,
                              },
                              onCompleted: toast.success('Success!'),
                            },
                          });
                        }}
                      >
                        LIKE
                      </Button>
                      <a href={to}>
                        <Button variant="contained" color="primary" size="small" onClick="">
                          PLEDGE
                        </Button>
                      </a>
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center' }}>
                    <Typography>Total Pledged: {pledged}</Typography>
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
                        minHeight: '150px',
                      }}
                    >
                      <Grid xs={12} sm={12} md={12} lg={12}>
                        <Typography
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgba(0,0,0,0.5)',
                            marginLeft: '10px',
                          }}
                        >
                          {' '}
                          Highlights
                        </Typography>
                        <ul>
                          <Typography
                            style={{
                              fontSize: '0.75rem',
                              color: 'rgba(0,0,0,0.5)',
                            }}
                          >
                            <li>{highlight_1}</li>
                            <li>{highlight_2}</li>
                            <li>{highlight_3}</li>
                          </Typography>
                        </ul>
                      </Grid>
                    </Grid>
                    {/* Row 3 - Deal Lead
                    <Grid
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
                        textAlign: 'center',
                        marginBottom: '0.25rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '0.75rem',
                          color: '#fff',
                          fontWeight: '900',
                          background: 'blue',
                          padding: '0.25rem',
                          borderRadius: '4px',
                          marginLeft: '10px',
                        }}
                      >
                        {deal_lead}
                      </Typography>
                    </Grid> */}
                    {/* Row 4 - Allocation, % */}
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
                        {/* <Typography style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                          Pledged
                        </Typography>
                        <Typography style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.85)', fontWeight: '900' }}>
                          {pledged}
                        </Typography> */}
                        <Typography
                          style={{
                            fontSize: '0.75rem',
                            color: '#fff',
                            fontWeight: '900',
                            background: 'blue',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            marginLeft: '10px',
                          }}
                        >
                          {deal_lead}
                        </Typography>
                      </Grid>
                      <Grid xs={12} sm={4} md={4} lg={4}>
                        <Typography style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                          Round
                        </Typography>
                        <Typography style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.85)', fontWeight: '900' }}>
                          {round}
                        </Typography>
                      </Grid>
                      <Grid xs={12} sm={4} md={4} lg={4}>
                        <Typography style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                          Days Left
                        </Typography>
                        <Typography style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.85)', fontWeight: '900' }}>
                          15 Days
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
