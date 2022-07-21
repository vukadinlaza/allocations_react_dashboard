import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, ButtonBase } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ReactHtmlParser from 'react-html-parser';
import useStyles from '../styles';

/** *
 *
 * All the pieces of the deal flow
 * which includes showing the deal data room
 * the pledging chart/actions
 * the embedded docusign onboarding document
 * the wiring document
 *
 * */

export const GET_INVESTOR = gql`
  query GetInvestor($_id: String) {
    user(_id: $_id) {
      _id
      email
      documents
      country
      investments {
        _id
        status
        amount
        documents {
          link
          path
        }
      }
    }
  }
`;

function DataRoom({ deal }) {
  const classes = useStyles();
  return (
    <div className={classes.dealDataRoom}>
      {(deal.documents || [])
        .filter((d) => d.path !== 'wire-instructions' && !d.path.includes('s-'))
        .map((doc) => (
          <span key={doc.path}>
            <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon="link" /> {doc.path}
            </a>
          </span>
        ))}
      {deal.memo && <div className={classes.dealMemo}>{ReactHtmlParser(deal.memo)}</div>}
    </div>
  );
}

export default function InvestmentFlow({ deal, investor }) {
  const [status, setStatus] = useState('invited');
  const classes = useStyles();
  console.log(deal._id);
  const { data } = useQuery(GET_INVESTOR, {
    variables: { deal_id: deal._id, _id: investor._id },
    pollInterval: 1000,
  });
  if (!data) return null;
  const { user: polledInvestor } = data;
  const investment = polledInvestor.investments.find((i) => i.deal_id === deal._id) || null;

  // const investment = _.get(polledInvestor, 'investments[0]', null);

  return (
    <>
      <div className={classes.tabs}>
        <Grid container justify="center">
          <Grid item xs={12} sm={3}>
            <ButtonBase
              className={status === 'invited' ? classes.activeTab : classes.tab}
              style={{ borderRight: '1px solid #e1e9ec' }}
              onClick={() => setStatus('invited')}
            >
              Data Room{' '}
              {investment && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>{status === 'invited' && <DataRoom deal={deal} classes={classes} />}</>
    </>
  );
}
