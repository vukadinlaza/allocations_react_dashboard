import React, { useState, useEffect } from 'react';
import _, { toNumber } from 'lodash';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import base64 from 'base-64';
import {
  Paper,
  Grid,
  TextField,
  Button,
  ButtonBase,
  Table,
  TableBody,
  ButtonGroup,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ReactHtmlParser from 'react-html-parser';
import { makeStyles } from '@material-ui/core/styles';
import DocusignKYCEmbeddedForm from '../../forms/kycTab';
import { nWithCommas } from '../../../utils/numbers';
import Loader from '../../utils/Loader';
import InvestorEditForm from '../../forms/InvestorEdit';

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
  query GetInvestor($deal_id: String!, $_id: String) {
    investor(_id: $_id) {
      _id
      email
      documents
      country
      dealInvestments(deal_id: $deal_id) {
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

function getOnboardingLinkType(link) {
  try {
    const url = new URL(link);
    if (url.hostname === 'na3.docusign.net') {
      return 'docusign';
    }
    if (url.hostname === 'app.hellosign.com') {
      return 'hellosign';
    }
  } catch (e) {
    return 'docusign';
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: '#f9fbfb',
  },
  divider: {
    margin: '16px -16px',
  },
  tabs: {
    borderTop: '1px solid #dfe3e9',
    borderBottom: '1px solid #dfe3e9',
    background: '#f7f9fa',
    minHeight: 44,
    margin: '40px 0',
  },
  text: {
    color: '#7f8ea3',
  },
  tab: {
    height: 75,
    width: '100%',
  },
  activeTab: {
    height: 75,
    width: '100%',
    borderBottom: '3px solid #205DF5',
    outline: '0 !important',
  },
  button: {
    margin: '.5rem',
  },
}));

export default function InvestmentFlow({ deal, investor, refetch }) {
  const [status, setStatus] = useState('invited');
  const classes = useStyles();
  const { data } = useQuery(GET_INVESTOR, {
    variables: { deal_id: deal._id, _id: investor._id },
    pollInterval: 1000,
  });
  if (!data) return null;
  const { investor: polledInvestor } = data;
  const investment = _.get(polledInvestor, 'dealInvestments[0]', null);
  const onboardingLinkType = getOnboardingLinkType(deal.onboarding_link) || 'docusign';
  const { approved } = deal;
  const docs = _.get(polledInvestor, 'documents') || [];
  const spvDoc = investment?.documents.find((d) => {
    return (
      d?.path.includes('SPV') ||
      d?.path.includes('LPA') ||
      d?.path.toLowerCase().includes('fund') ||
      d?.path.toLowerCase().includes('final')
    );
  });
  const hasWired = investment?.status === 'wired' || investment?.status === 'complete';
  const hasSigned =
    (investment?.status === 'signed' ||
      investment?.status === 'wired' ||
      investment?.status === 'complete') &&
    spvDoc;
  const hasKyc = docs.find(
    (d) => d.documentName && (d.documentName.includes('W-8') || d.documentName.includes('W-9')),
  );
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

          <Grid item xs={12} sm={3}>
            <ButtonBase
              className={status === 'pledged' ? classes.activeTab : classes.tab}
              style={{
                borderRight: '1px solid #e1e9ec',
                cursor: approved ? 'cursor' : 'not-allowed',
              }}
              onClick={() => approved && setStatus('pledged')}
            >
              Sign {!approved && <FontAwesomeIcon icon="lock" />}{' '}
              {hasSigned && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>

          <Grid item xs={12} sm={3}>
            <ButtonBase
              className={status === 'kyc' ? classes.activeTab : classes.tab}
              style={{
                borderRight: '1px solid #e1e9ec',
                cursor: approved ? 'cursor' : 'not-allowed',
              }}
              onClick={() => approved && setStatus('kyc')}
            >
              KYC {!approved && <FontAwesomeIcon icon="lock" />}{' '}
              {hasKyc && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>

          <Grid item xs={12} sm={3}>
            <ButtonBase
              className={status === 'onboarded' ? classes.activeTab : classes.tab}
              style={{ cursor: approved ? 'cursor' : 'not-allowed' }}
              onClick={() => approved && setStatus('onboarded')}
            >
              Wire {!approved && <FontAwesomeIcon icon="lock" />}{' '}
              {hasWired && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {status === 'invited' && <DataRoom deal={deal} />}
        {status === 'pledging' && (
          <Pledging investment={investment} investor={investor} deal={deal} refetch={refetch} />
        )}
        {status === 'onboarded' && <Wire investment={investment} deal={deal} />}
        {/** Always render Onboarding so that the Docusign loads in... * */}
        {onboardingLinkType === 'docusign' && status === 'pledged' && (
          <Onboarding
            status={status}
            dealInvestments={polledInvestor.dealInvestments}
            investment={investment}
            deal={deal}
            investor={investor}
            data={data}
            hasSigned={hasSigned}
            refetch={refetch}
          />
        )}
        {status === 'kyc' && (
          <KYCDocusign
            status={status}
            investment={investment}
            deal={deal}
            investor={investor}
            hasKyc={hasKyc}
          />
        )}
        {onboardingLinkType === 'hellosign' && (
          <HelloSignOnboarding
            status={status}
            investment={investment}
            deal={deal}
            investor={investor}
          />
        )}
      </>
    </>
  );
}

function DataRoom({ deal }) {
  return (
    <div className="deal-data-room">
      {(deal.documents || [])
        .filter((d) => d.path !== 'wire-instructions' && !d.path.includes('s-'))
        .map((doc) => (
          <span key={doc.path}>
            <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon="link" /> {doc.path}
            </a>
          </span>
        ))}
      {deal.memo && <div className="deal-memo">{ReactHtmlParser(deal.memo)}</div>}
    </div>
  );
}

function Wire({ deal }) {
  const link =
    deal.documents && deal.documents.find((d) => d.path === 'wire-instructions')
      ? `https://${deal.documents.find((d) => d.path === 'wire-instructions').link}`
      : null;

  if (!link) {
    return (
      <div className="wire" style={{ padding: '20px' }}>
        Contact For Wire Details
      </div>
    );
  }

  return (
    <div className="wire" style={{ textAlign: 'center' }}>
      <div className="banner same-user-warning">
        Please ensure to wire from the same entity you have signed from.
      </div>
      <div className="wire-link">
        <div style={{ marginBottom: '15px' }}>
          <FontAwesomeIcon icon={['far', 'file-pdf']} />
          <a href={link} target="_blank" rel="noopener noreferrer">
            {' '}
            Wire Instructions
          </a>
        </div>
        <div className="wire-doc-iframe">
          <div className="embed-responsive embed-responsive-1by1">
            <iframe className="embed-responsive-item" title="Onboarding Document" src={link} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PledgingLegacy({ deal }) {
  return (
    <a href={deal.pledge_link} target="_blank" rel="noopener noreferrer">
      <svg
        style={{ height: 18, margin: '0 8px' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3800 4800"
      >
        <g>
          <path fill="#0F9D57" d="M0 4800h3800V840L2960 0H0" />
          <path fill="#57BB8A" d="M2960 840h840L2960 0" />
          <path fill="#098540" d="M3800 1680V840h-840" />
        </g>
        <g>
          <path
            fill="#FFF"
            d="M1695 2822h1023v424H1695v-424zm-635 0h459v424h-459v-424zm635-635h1023v459H1695v-459zm-635 0h459v459h-459v-459zm635-599h1023v458H1695v-458zm-635 0h459v458h-459v-458zM884 3422h2011V1411H884v2011z"
          />
        </g>
      </svg>
      <strong style={{ color: '#4bc076' }}>Pledge Document</strong>
    </a>
  );
}

const PLEDGE = gql`
  mutation Pledge($investment: InvestmentInput!) {
    updateInvestment(investment: $investment) {
      _id
      amount
      status
    }
  }
`;

function Pledging({ investment, deal, refetch, investor }) {
  const [amount, setAmount] = useState('');
  const classes = useStyles();
  const [updateInvestment] = useMutation(PLEDGE, {
    onCompleted: refetch,
  });

  useEffect(() => {
    setAmount(investment.amount || '');
  }, [investment.amount]);

  const updateAmount = (e) => {
    const val = e.target.value;
    if (!isNaN(Number(val))) setAmount(val);
  };

  const submit = () => {
    // TODO - check that its over the min investment (if min investment exists)

    updateInvestment({
      variables: {
        investment: {
          ..._.omit(investment, '__typename'),
          status: 'pledged',
          amount: Number(amount),
        },
      },
    });
  };

  const unpledge = () => {
    updateInvestment({
      variables: {
        investment: { ..._.omit(investment, '__typename'), status: 'invited', amount: null },
      },
    });
  };

  // if no investor just show doc
  const noInvestor = !investor || _.isEmpty(investor);

  // old deal is deal created before May, 1
  const oldDeal = !deal.created_at || deal.created_at < 1588334400000;
  if (oldDeal) {
    return (
      <div className="pledging">
        <PledgingLegacy deal={deal} />
      </div>
    );
  }

  if (noInvestor) {
    return (
      <div className="pledging">
        <div className="pledge-data">
          <PledgesViz deal={deal} />
          <PledgesTable deal={deal} />
        </div>
        <hr />
        <PledgingLegacy deal={deal} />
      </div>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Paper className={classes.paper}>
            {investment.status === 'invited' && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: 16 }}
                  label="Pledge Amount"
                  value={amount}
                  onChange={updateAmount}
                />
                <Button size="large" fullWidth variant="contained" color="primary" onClick={submit}>
                  Pledge
                </Button>

                <Typography
                  variant="body2"
                  className={classes.text}
                  style={{ marginTop: 8, textAlign: 'center', lineHeight: '34px' }}
                >
                  or <br />
                  pledge via spreadsheet <PledgingLegacy deal={deal} />
                </Typography>
              </>
            )}
            {investment.status !== 'invited' && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  className="pledge-amount"
                  label="Pledge Amount"
                  value={amount}
                  onChange={updateAmount}
                />
                <ButtonGroup style={{ marginTop: 16 }}>
                  <Button variant="contained" color="primary" onClick={submit}>
                    Edit
                  </Button>
                  <Button color="primary" onClick={unpledge}>
                    Unpledge
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Paper>

          <PledgesViz deal={deal} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <PledgesTable deal={deal} />
        </Grid>
      </Grid>
    </>
  );
}

function PledgesTable({ deal }) {
  const classes = useStyles();

  if (!deal.pledges) return null;

  return (
    <Paper className={classes.paper}>
      <Table size="small">
        <TableBody>
          {deal.pledges.map((pledge) => (
            <TableRow key={pledge.timestamp}>
              <TableCell>{pledge.initials}</TableCell>
              <TableCell>${nWithCommas(pledge.amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="total">
            <TableCell>Total</TableCell>
            <TableCell>${nWithCommas(_.sumBy(deal.pledges, 'amount'))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

function PledgesViz({ deal }) {
  const classes = useStyles();
  const pledges = _.get(deal, 'pledges', null);

  useEffect(() => {
    if (!pledges || pledges.length === 0) return;

    let formatted = [];
    deal.pledges.reduce((acc, p) => {
      formatted.push({ timestamp: Number(p.timestamp), amount: acc + p.amount });
      return acc + p.amount;
    }, 0);

    // pop a 0 on 1 day before first pledge
    formatted.unshift({ timestamp: formatted[0].timestamp - 60000 * 60 * 24, amount: 0 });
    formatted = _.orderBy(formatted, '');
  }, [deal, pledges]);

  if (!pledges || pledges.length === 0) {
    return (
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <small>No graph available yet, be the first to pledge to {deal.company_name}!</small>
      </div>
    );
  }

  return (
    <Paper className={classes.paper} style={{ marginTop: 16 }}>
      <canvas id="pledges-viz" />
    </Paper>
  );
}

function HelloSignOnboarding({ deal, investor, status }) {
  if (!investor) return <Loader />;

  return (
    <div className={status === 'pledged' ? 'document-iframe' : 'document-iframe hide'}>
      <div className="external-sign-link">
        <a href={deal.onboarding_link} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon="signature" /> Onboarding Document
        </a>
      </div>
    </div>
  );
}

function filename(path) {
  try {
    return path.split('/')[2];
  } catch {
    return path;
  }
}

function Onboarding({ dealInvestments, deal, investor, status, hasSigned, refetch, investment }) {
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestor] = useState(null);
  const [numDocs, setNumDocs] = useState(0);
  const [resign, setResign] = useState(false);
  const classes = useStyles();
  const { search, pathname } = useLocation();
  const isTvc = deal.organization === 'theventurecollective';
  const decodedParams = {};
  if (isTvc) {
    base64.decode(search.substring(1));
  }
  const paramsToUse = isTvc ? decodedParams : search;
  const p = new URLSearchParams(paramsToUse);
  const amount = toNumber(p.get('amount')); // is the number 123
  const shares = toNumber(p.get('shares')) || 0; // is the number 123
  const units = toNumber(p.get('units')) || ''; // is the number 123
  const purchasePrice = toNumber(p.get('purchasePrice')) || ''; // is the number 123

  const docs = dealInvestments.reduce((acc, inv) => {
    const docs = _.get(inv, 'documents', []);
    return [...acc, ...docs];
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    setInvestor({ ...investor });
  }, [investor, setInvestor]);

  useEffect(() => {
    setNumDocs(docs.length);

    if (docs.length > numDocs) {
      setResign(false);
    }
  }, [docs.length, investment, numDocs]);

  if (!deal.onboarding_link) {
    return (
      <div style={{ display: status === 'pledged' ? 'block' : 'none' }}>
        Hang tight!
        <span role="img" aria-label="hour glass">
          ⌛
        </span>
        <br />
        Onboarding link coming soon
      </div>
    );
  }

  if (!investor) return <Loader />;
  const params = {
    userEmail: investor.email,
  };

  if (amount) {
    params.investmentAmount = amount;
    params.SubAmount = amount;
    params.MomentusPCS = shares;
  }
  if (units) {
    params.Units = units;
  }
  if (purchasePrice) {
    params.PurchasePrice = purchasePrice;
  }

  const urlParameters = Object.entries(params)
    .map((e) => e.map(encodeURI).join('='))
    .join('&');

  let link = pathname.includes('/public/')
    ? deal.onboarding_link
    : `${deal.onboarding_link}&${urlParameters}`;

  if (deal.onboarding_link.includes('demo')) {
    link = `${deal.onboarding_link}&${urlParameters}`;
  }
  const handleSubmit = (res) => {
    if (res === 'complete') {
      refetch();
    }
  };
  const reqs =
    investor.investor_type === 'individual'
      ? ['last_name', 'first_name', 'email']
      : ['entity_name', 'email', 'signer_full_name'];
  const isProfileComplete = reqs.every(
    (i) => Object.keys(investor).includes(i) && investor[i] !== null,
  );

  if (hasSigned && !resign)
    return (
      <Paper className={classes.paper}>
        <Grid container>
          <Grid xs={10} sm={10} md={10} lg={10}>
            <Typography variant="subtitle1">
              Thanks for signing! You can view your signed documents below.
            </Typography>
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setResign(true);
              }}
            >
              Re-sign Documents
            </Button>
          </Grid>
        </Grid>
        {docs.map((doc) => {
          return (
            <Typography variant="subtitle2">
              <span>
                <a href={`https://${doc?.link}`} target="_blank" rel="noopener noreferrer">
                  {filename(doc?.path)}
                </a>
              </span>{' '}
            </Typography>
          );
        })}
      </Paper>
    );
  if (!isProfileComplete) {
    return (
      <InvestorEditForm
        investor={investorData}
        actionText="Save"
        setInvestor={setInvestor}
        setFormStatus={handleSubmit}
      />
    );
  }
  return (
    <div className={status === 'pledged' ? 'document-iframe' : 'document-iframe hide'}>
      {loading && (
        <div className="temp-loader">
          <Loader />
        </div>
      )}
      <div className="external-sign-link">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3>
            <FontAwesomeIcon icon="signature" /> Open Directly
          </h3>
        </a>
      </div>
      <div className="embed-responsive embed-responsive-1by1">
        <iframe
          className="embed-responsive-item"
          title="Wire Instructions"
          data-hj-allow-iframe=""
          src={link}
        />
      </div>
    </div>
  );
}

function KYCDocusign({ deal, investor, status, hasKyc }) {
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState();
  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (!deal) return <Loader />;

  if (!link?.redirectUrl || hasKyc)
    return (
      <DocusignKYCEmbeddedForm
        hasKyc={hasKyc}
        setLink={setLink}
        deal_slug={deal.deal_slug}
        org={deal.organization}
        company_name={deal.company_name}
        dealType={deal.dealParams.dealType}
      />
    );

  return (
    <Paper className={classes.paper}>
      <div className={status === 'kyc' ? 'document-iframe' : 'document-iframe hide'}>
        {loading && (
          <div className="temp-loader">
            <Loader />
          </div>
        )}
        <div className="external-sign-link">
          <Typography variant="h4" align="center">
            {link.formName}
          </Typography>
          <a href={link.redirectUrl} target="_blank" rel="noopener noreferrer center">
            <h3>
              <FontAwesomeIcon icon="signature" /> Open Directly{' '}
            </h3>
          </a>
        </div>
        <div className="embed-responsive embed-responsive-1by1">
          <iframe
            className="embed-responsive-item"
            title="Wire Instructions"
            src={link.redirectUrl}
          />
        </div>
      </div>
    </Paper>
  );
}
