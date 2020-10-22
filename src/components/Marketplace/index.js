import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor'; // import the script
import { withStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';
import ChevronRight from '@material-ui/icons/ChevronRight';

import { Grid, Button, Typography, Tooltip, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
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

const deals = [
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1A8kmlgjPoxtrlgdwUa6e5nY9bBisCjJBBi--Nc7JVa8/edit#gid=0',
    name: 'SpaceX',
    tagline: 'Advanced rockets and spacecrafts',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/spacex.png',
    est_personal_inv: '$10,000',
    highlight_2: 'Currently deploying Starlink satellite internet network',
    highlight_3: '$46B valuation',
    pledged: '$162,000',
    deal_lead: 'Ryan Kriser',
    closeDate: '10/31/2020',
    round: 'Series N',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1s_f6gMA5eGV-YIBAOoRpSB2u19KiHX2Ly4KdZn1vx0Y/edit#gid=0',
    name: 'Cognitive Space',
    tagline: 'Autonomous satellite systems',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/cognitive-space.png',
    est_personal_inv: '$100,000',
    highlight_2: 'Secured Air Force grants and has several government partnerships in place',
    highlight_3: '6.5M valuation',
    pledged: '$100,000',
    deal_lead: 'Meagan Crawford',
    closeDate: '11/10/2020',
    round: 'Seed',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1EJCO1SURyv-rbnhoo9EbkR2mFydKfPBBgI2XYIVURDM/edit#gid=0',
    name: 'Luminous',
    tagline: 'Photonics chip company backed by Bill Gates',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/luminous.png',
    est_personal_inv: '$150,000',
    highlight_2: 'Claims it has solved the current bottleneck in moving data around',
    highlight_3: 'Single chip may replace 3000 TPU boards',
    pledged: '$79,000',
    deal_lead: 'Joshua Browder',
    closeDate: '10/31/2020',
    round: 'Secondary',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1ebS6A0bD8hb9RWpw94VLz_AVIQQByVTvUIEy2lAZKhs/edit#gid=0',
    name: 'OnDeck Runway Fund',
    tagline: 'The first place the best talent looks when starting or joining a startup',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/runway_fund.png',
    est_personal_inv: '$15,000',
    highlight_2: '450 Fellows have so far started 160 companies',
    highlight_3: 'Raising a $5M fund, which invests in 80-100 companies over the next 12-18 months',
    pledged: '$35,000',
    deal_lead: 'Don Ho',
    closeDate: '10/31/2020',
    round: 'N/A',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1xKMQzP3mRvNLc6HsBiSFCDbxjoRASLVdgd7I4E6c2tQ/edit#gid=0',
    name: 'Brex',
    tagline: 'Corporate credit cards',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/brex.png',
    est_personal_inv: '$25,000',
    highlight_2: 'Financing alternatives for startups',
    highlight_3: 'Offers corporate credit cards and cash management accounts to tech companies',
    pledged: '$25,000',
    deal_lead: 'Kingsley Advani',
    closeDate: '10/31/2020',
    round: 'Secondary',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1dlkEmnt7Ls9f5Pic7AgKSF4JwnZtVM3MreSgU1mm_VU/edit#gid=0',
    name: 'Venus Aerospace',
    tagline: 'Hypersonic travel',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/venus-aerospace.png',
    est_personal_inv: 'TBD',
    highlight_2: 'Concept verified by NASA',
    highlight_3: 'The fastest way in history to get-door-to-door',
    pledged: '$22,000',
    deal_lead: 'Jai Malik',
    closeDate: '10/31/2020',
    round: 'Seed',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1EJJgDbSm4pOPZ5zFkzek2atiYWAoYZTfZExakwppGxw/edit#gid=0',
    name: 'Sana Health',
    tagline: 'Neuromodulation technology to end chronic pain',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/sana-health.png',
    est_personal_inv: '$500,000',
    highlight_2: 'Improved quality of life for 90% of subjects with fibromyalgia',
    highlight_3: '3x times reduction in pain level in a 75-person pain study ',
    pledged: '$7,000',
    deal_lead: 'Daniel Weiss Pick',
    closeDate: '10/31/2020',
    round: 'Third round',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1EJJgDbSm4pOPZ5zFkzek2atiYWAoYZTfZExakwppGxw/edit#gid=0',
    name: 'Agronomics',
    tagline: 'Sustainable investment in clean meat',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/agronomics.png',
    est_personal_inv: '$5,000',
    highlight_2: 'Portfolio companies include BlueNalu, New Age Meats, Shiok Meats and Legendairy',
    highlight_3: 'Agronomics wants to decrease the unsustainable demand on natural resources',
    pledged: '$5,000',
    deal_lead: 'Kingsley Advani',
    closeDate: '10/31/2020',
    round: 'N/A',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/u/2/d/1oI0TduSQcs2_Ya2ldbZ6rMZ2RbLE8h7StadJK-_E4c0/edit',
    name: 'Mati',
    tagline: 'Data infrastructure for the trust economy',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/mati-id.png',
    est_personal_inv: 'TBD',
    highlight_2: '5.8x YoY revenue growth, $1.85M ARR',
    highlight_3: 'Raising an $8M Series A round at a $60M valuation',
    pledged: '$5,000',
    deal_lead: 'Tribe Capital',
    closeDate: '10/31/2020',
    round: 'Series A',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1o0joVOj-R-b5ZGZLyhIT3Ey-4bVQEOqZc0vwuVfk3IM/edit#gid=0',
    name: 'ArcType',
    tagline: 'Intuitive SQL client for developers and teams',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/arctype.png',
    est_personal_inv: '$2,000',
    highlight_2: 'Previous investors include Chamath Palihapitiya',
    highlight_3: ' Pre-revenue; 400+ signups and approx 50 WAUs',
    pledged: '$2,000',
    deal_lead: 'Jai Malik',
    closeDate: '10/31/2020',
    round: 'Pre-seed',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1w-rDxctNyycpcQBDi43-0VQglKvAlWJfqC7ETZz1EdM/edit#gid=0',
    name: 'Factmata',
    tagline: 'AI company for online content risk management',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/factmata.png',
    est_personal_inv: 'TBD',
    highlight_2: '~£20-30k MRR revenue',
    highlight_3: 'Raising £1.5M at £5M pre-money valuation',
    pledged: '$2,000',
    deal_lead: 'Giacomo Marriotti',
    closeDate: '10/31/2020',
    round: 'Bridge to A',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1ulnVK-O2lY3uGgOhc11rW0WDxcigONC858MLcCEPBG0/edit',
    name: 'Axiom Space',
    tagline: 'Building a commercial space station',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/axiom_space.png',
    est_personal_inv: 'TBD',
    highlight_2: 'Revenue streams: space tourism, astronaut training and research',
    highlight_3: 'Valuation is estimated to be around $650M',
    pledged: '$0',
    deal_lead: 'Nicholas Shekerdemian',
    closeDate: '10/31/2020',
    round: 'Series B',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1rYovX8o5OqW2u40QlIKH3vru9t0fXAhnBPgxXjeZ_xw/edit#gid=0',
    name: 'Cheqout',
    tagline: 'A QR payments company for brick-and-mortar transactions',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/cheqout.png',
    est_personal_inv: 'TBD',
    highlight_2: 'Crossed $1M in processed payments last month, 3 months after launch',
    highlight_3: 'TAM is $800B in restaurant revenues, SOM is $170B in full service—CheqOut takes 1.8% of revenue',
    pledged: '$0',
    deal_lead: 'Jerry Chang',
    closeDate: '10/31/2020',
    round: 'Series A',
  },
  {
    color: randomColor({
      luminosity: 'light',
      hue: 'blue',
    }),
    to: 'https://docs.google.com/spreadsheets/d/1zpDZcwsqfT_B_B6WhyaNR1QUUtrBX0bRR4WBAYiowPI/edit#gid=0',
    name: 'Sen',
    tagline: 'Real-time videos from space',
    logo: 'https://allocations-public.s3.us-east-2.amazonaws.com/marketplace/sen.png',
    est_personal_inv: 'TBD',
    highlight_2: 'Have been informally contacted by Elon Musk',
    highlight_3: 'Seed valuation: $15.71M, raising $4.19M',
    pledged: '$0',
    deal_lead: 'Ryan Kriser',
    closeDate: '10/31/2020',
    round: 'Seed',
  },
];

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

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 400,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  return (
    <div className="blue-container">
      <Grid>
        <h4 style={{ color: '#fff ' }}>Top Deals by Pledges</h4>
        <h6 style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.65rem' }}>
          {' '}
          Allocations is not affiliated with, sponsors, or endorses any of the companies listed on this site. Content on
          this page is provided for informational purposes only, may not reflect the most current data, and should not
          be relied upon. You should do your own due diligence when making any investment in a company listed on this
          site. The order in which companies are displayed on this site does not imply any endorsement or
          recommendation, but simply a categorization based upon the characteristics of the offering (e.g. amount
          pledged).{' '}
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

        {/* ITEM 2 - NAME */}
        <Grid
          xs={12}
          sm={12}
          md={3}
          lg={3}
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

        {/* ITEM 3 Personal Investment Amount */}
        <Grid xs={12} sm={1} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Typography
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            Est. Personal Investment
          </Typography>
        </Grid>

        {/* ITEM 4 */}
        <Grid xs={12} sm={12} md={2} lg={2} style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Typography
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            Deal Lead
          </Typography>
        </Grid>

        {/* ITEM 5 */}
        <Grid xs={12} sm={12} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Typography
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            Pledged
          </Typography>
        </Grid>

        {/* ITEM 6 */}
        <Grid xs={12} sm={12} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Typography
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            Closing Date
          </Typography>
        </Grid>
        {/* ITEM 6 */}
        <Grid xs={12} sm={2} md={2} lg={2} style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Typography
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
            }}
          />
        </Grid>
        {/* ITEM 6 */}
        <Grid xs={12} sm={12} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Typography
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
            }}
          />
        </Grid>
        {deals.map(
          ({
            to,
            name,
            tagline,
            est_personal_inv,
            highlight_1,
            highlight_2,
            highlight_3,
            logo,
            pledged,
            deal_lead,
            sharePrice,
            round,
            closeDate,
            color,
          }) => (
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
                  xs={12}
                  sm={12}
                  md={1}
                  lg={1}
                  style={{ justifyContent: 'center', alignContent: 'center', padding: '0.5rem' }}
                >
                  <img src={logo} alt="oops" style={{ width: '100%', height: 'auto' }} />
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
                    xs={12}
                    sm={12}
                    md={3}
                    lg={3}
                    style={{ justifyContent: 'center', alignContent: 'center', paddingRight: '15px' }}
                  >
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
                </HtmlTooltip>

                {/* ITEM 3 Personal Investment Amount */}
                <Grid xs={12} sm={1} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
                  <Typography
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(0,0,0,0.8)',
                      paddingTop: '1rem',
                    }}
                  >
                    {est_personal_inv}
                  </Typography>
                </Grid>

                {/* ITEM 4 */}
                <Grid xs={12} sm={12} md={2} lg={2} style={{ justifyContent: 'center', alignContent: 'center' }}>
                  <Typography
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.9)',
                      paddingTop: '1rem',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: color,
                        maxWidth: 'fit-content',
                        borderRadius: '.5rem',
                        padding: '.2rem',
                      }}
                    >
                      {deal_lead}
                    </div>
                  </Typography>
                </Grid>

                {/* ITEM 5 */}
                <Grid xs={12} sm={12} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
                  <Typography
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.9)',
                      paddingTop: '1rem',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#85bb65',
                        maxWidth: 'fit-content',
                        borderRadius: '.5rem',
                        padding: '.2rem',
                      }}
                    >
                      {pledged}
                    </div>
                  </Typography>
                </Grid>

                {/* ITEM 6 */}
                <Grid xs={12} sm={12} md={1} lg={1} style={{ justifyContent: 'center', alignContent: 'center' }}>
                  <Typography
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(0,0,0,0.8)',
                      paddingTop: '1rem',
                    }}
                  >
                    {closeDate}
                  </Typography>
                </Grid>

                {/* ITEM 7 */}
                <Grid
                  xs={12}
                  sm={2}
                  md={2}
                  lg={2}
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
                    REQUEST INVITE
                  </Button>
                </Grid>

                {/* ITEM 8 */}
                <Grid
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  style={{ justifyContent: 'center', alignContent: 'around', padding: '0.5rem' }}
                >
                  <a href={to} target="_blank" rel="noreferrer">
                    <Button variant="contained" color="primary" size="small" onClick="">
                      PLEDGE
                    </Button>
                  </a>
                </Grid>
              </Grid>
            </Grid>
          ),
        )}
      </Grid>
    </div>
  );
}
