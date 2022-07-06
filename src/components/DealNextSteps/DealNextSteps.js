import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Button, Menu, MenuItem } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import './styles.scss';
import Confetti from 'react-confetti';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { useHistory, useParams, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import signInvestmentYes from '../../assets/sign-investment-yes.svg';
import submitTaxInfoYes from '../../assets/submit-tax-info-yes.svg';
import submitTaxInfoNo from '../../assets/submit-tax-info-no.svg';
import AllocationsRocket from './AllocationsRocket/AllocationsRocket';
import KYCModal from './KYCModal';
import WireInstructionsModal from './WireInstructionsModal/WireInstructionsModal';
import PaymentSelectModal from './PaymentSelectModal/index';
import { useAuth } from '../../auth/useAuth';

const CryptoPaymentModalRemote = React.lazy(() =>
  // eslint-disable-next-line import/extensions
  import('blockchain/CryptoPaymentModalRemote'),
);
const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    user(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      documents
      accredidation_status
      investments {
        _id
        deal {
          _id
          slug
        }
        amount
        value
        submissionData {
          country
          state
          investor_type
          legalName
          accredited_investor_status
          fullName
          title
          investmentId
          submissionId
        }
      }
    }
  }
`;

const GET_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    deal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      company_name
      name
      accept_crypto
      isDemo
      dealParams {
        dealType
      }
      company_name
      documents {
        path
        link
      }
    }
  }
`;

const GET_INVESTMENT = gql`
  query GetInvestment($_id: String!) {
    investment(_id: $_id) {
      _id
      status
      amount
      wire_instructions {
        link
        path
      }
      submissionData {
        investor_type
        country
      }
    }
  }
`;

const GET_CRYPTO_OPTIONS = gql`
  query GetCryptoOptions($deal_id: String!) {
    cryptoOptions(deal_id: $deal_id) {
      crypto_payments
    }
  }
`;

function DealNextSteps() {
  const [confetti, showConfetti] = useState(false);
  const { data, loading, refetch } = useQuery(GET_INVESTOR, { fetchPolicy: 'network-only' });
  const [getDeal, { data: dealData, called: calledDeal }] = useLazyQuery(GET_DEAL);

  const [showTaxAsCompleted, setShowTaxAsCompleted] = useState(false);
  const [open, setOpen] = useState(false);

  const { deal_slug, organization } = useParams();
  const [openPayment, setOpenPayment] = useState(false);
  const [cryptoPaymentOpen, setCryptoPaymentOpen] = useState(false);
  const [wireInstructionsOpen, setWireInstructionsOpen] = useState(false);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { search } = useLocation();
  const params = queryString.parse(search);
  const history = useHistory();

  const [kycTemplate, setKycTemplate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const path = organization ? `/deals/${organization}/${deal_slug}` : `/deals/${deal_slug}`;

  const [getInvestment, { data: investmentData }] = useLazyQuery(GET_INVESTMENT, {
    variables: { _id: params?.investmentId },
    // onError: () => {
    //   if (!state?.investorFormData) return history.push(path);
    // },
  });

  const investorFormData =
    history?.location?.state?.investorFormData ||
    investmentData?.investment?.submissionData ||
    null;

  const [getCryptoOptions, { data: cryptoOptionsData, called: calledCrypto }] =
    useLazyQuery(GET_CRYPTO_OPTIONS);

  useEffect(() => {
    if (!authLoading && !calledDeal && isAuthenticated && deal_slug) {
      getDeal({
        variables: {
          deal_slug,
          fund_slug: organization || 'allocations',
        },
        fetchPolicy: 'network-only',
      });

      if (params?.investmentId) {
        getInvestment();
      }
    }
  }, [isAuthenticated, authLoading, calledDeal, getDeal, deal_slug, organization]);

  useEffect(() => {
    if (dealData && !calledCrypto) {
      getCryptoOptions({
        variables: {
          deal_id: dealData?.deal._id,
        },
        fetchPolicy: 'network-only',
      });
    }
  }, [dealData, calledCrypto, getCryptoOptions]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });

    const confettiOn = setTimeout(() => {
      showConfetti(true);
    }, 1000);
    const confettiOff = setTimeout(() => {
      showConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(confettiOn);
      clearTimeout(confettiOff);
    };
  }, []);

  useEffect(() => {
    const templateInfo =
      investorFormData?.country === 'United States'
        ? investorFormData?.investor_type === 'individual'
          ? { templateName: 'W-9', templateId: 'tpl_dM4QcQbyLckdPXgtyx' }
          : { templateName: 'W-9-E', templateId: 'tpl_HSJjJ9c9jb2N4GXFkt' }
        : investorFormData?.investor_type === 'individual'
        ? { templateName: 'W-8-BEN', templateId: 'tpl_JmDP5PPQkSy7LYgJHF' }
        : { templateName: 'W-8-BEN-E', templateId: 'tpl_mXPLm5EXAyHJKhQekf' };

    setKycTemplate(templateInfo);
  }, [investorFormData]);

  if (loading || !cryptoOptionsData || !data || !dealData) return null;

  const handleInvestmentEdit = () => {
    const userInvestments = data?.user?.investments;
    const currentInvestment = userInvestments.find((inv) => inv.deal.slug === deal_slug);
    const { amount } = currentInvestment;
    const submission = currentInvestment.submissionData;

    history.push({
      pathname: `/invest/${organization}/${deal_slug}`,
      state: { submission, amount, investmentId: currentInvestment._id },
    });
  };

  const handleMenuItemClick = (template) => {
    setKycTemplate(template);
    setOpen(true);
    setAnchorEl(null);
  };

  const userDocs = data?.user?.documents || [];
  const hasKyc =
    userDocs.find((doc) => {
      return doc?.documentName.includes('W-9') || doc?.documentName.includes('W-8');
    }) || showTaxAsCompleted;

  const docs = dealData?.deal?.documents;
  const currentInvestment = data?.user?.investments.find((inv) => inv.deal.slug === deal_slug);

  return (
    <>
      <Helmet>
        <script async src={process.env.REACT_APP_VERIFY_INVESTOR_URL} />
      </Helmet>
      <section className="DealNextSteps">
        <div className="title-container">
          <div className="header-container">
            <h1 className="header">Next Steps</h1>
            <h3 className="sub-header">
              Please complete the following steps to finish your investment.
            </h3>
          </div>
          <a href={path} className="new-investment-button">
            <p className="action-header">
              <AddCircleIcon style={{ color: '#3AC522', marginRight: '6px' }} /> Add New Investment
            </p>
          </a>
        </div>

        <div className="action-items">
          <div className="action-item">
            <img className="action-icon" src={signInvestmentYes} alt="sign-investment-yes" />
            <div className="action-instructions">
              <p className="action-header">Edit Investment</p>
              <p className="action-sub-header">
                Basic Information including amount and personal information
              </p>
            </div>
            <Button className="completed-step-button" onClick={handleInvestmentEdit}>
              Edit Investment
            </Button>
          </div>
          <div className="action-item">
            <img className="action-icon" src={signInvestmentYes} alt="sign-investment-yes" />
            <div className="action-instructions">
              <p className="action-header">Sign for Investment</p>
            </div>
            <Button className="completed-step-button" disabled>
              Completed
            </Button>
          </div>

          <div className="action-item">
            <img
              className="action-icon"
              src={hasKyc ? submitTaxInfoYes : submitTaxInfoNo}
              alt="tax-info"
            />
            <div className="action-instructions">
              <p className="action-header">Submit Tax Information</p>
              <p className="action-sub-header">Complete your W8/W9 forms here</p>
            </div>

            {investorFormData ? (
              <Button
                className={hasKyc ? 'completed-step-button' : 'next-step-button'}
                onClick={() => setOpen(true)}
                disabled={!!hasKyc}
              >
                {hasKyc ? 'Completed' : 'Submit Tax Info'}
              </Button>
            ) : (
              <>
                <Button
                  className={hasKyc ? 'completed-step-button' : 'next-step-button'}
                  onClick={handleClick}
                  disabled={!!hasKyc}
                >
                  {hasKyc ? 'Completed' : 'Select Tax Form'}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick({
                        templateName: 'W-9',
                        templateId: 'tpl_dM4QcQbyLckdPXgtyx',
                      })
                    }
                  >
                    W-9 Individual
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick({
                        templateName: 'W-9-E',
                        templateId: 'tpl_HSJjJ9c9jb2N4GXFkt',
                      })
                    }
                  >
                    W-9 Entity
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick({
                        templateName: 'W-8-BEN',
                        templateId: 'tpl_JmDP5PPQkSy7LYgJHF',
                      })
                    }
                  >
                    W-8-BEN
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick({
                        templateName: 'W-8-BEN-E',
                        templateId: 'tpl_mXPLm5EXAyHJKhQekf',
                      })
                    }
                  >
                    W-8-BEN-E
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
          {/* //here */}
          {dealData?.deal?.dealParams?.dealType === '506c' && (
            <div className="action-item">
              <img
                className="action-icon"
                src={data?.user.accredidation_status === true ? submitTaxInfoYes : submitTaxInfoNo}
                alt="submit-tax-img"
              />
              <div className="action-instructions">
                <p className="action-header">Accredited Investor Status</p>
                <p className="action-sub-header">
                  {data?.user.accredidation_status === true
                    ? ''
                    : 'Complete your accredited investor questionnaire here (<5 mins to complete)'}
                </p>
              </div>
              {data?.user.accredidation_status === true ? (
                ''
              ) : (
                <Button
                  className={
                    data?.user.accredidation_status === true
                      ? 'completed-step-button'
                      : 'next-step-button'
                  }
                  onClick={() => {
                    const win = window.open(
                      'https://bridge.parallelmarkets.com/allocations',
                      '_blank',
                    );
                    win.focus();
                  }}
                >
                  {data?.user.accredidation_status === true ? 'Completed' : 'Submit'}
                </Button>
              )}
            </div>
          )}

          <div className="action-item">
            <img
              className="action-icon"
              src={
                investmentData?.investment?.status === 'wired' ||
                investmentData?.investment?.status === 'complete'
                  ? submitTaxInfoYes
                  : submitTaxInfoNo
              }
              alt="payment-info"
            />
            <div className="action-instructions">
              <p className="action-header">Fund Investment</p>
              <p className="action-sub-header">Required to complete your investment </p>
            </div>

            <Button
              className={
                investmentData?.investment?.status === 'wired' ||
                investmentData?.investment?.status === 'complete'
                  ? 'completed-step-button'
                  : 'next-step-button'
              }
              onClick={() => {
                setOpenPayment(true);
              }}
            >
              {investmentData?.investment?.status === 'wired' ||
              investmentData?.investment?.status === 'complete'
                ? 'Completed'
                : 'Select Funding Method'}
            </Button>
          </div>
        </div>
        {/* PaymentSelectModal to be temporarily retired while Crypto is in limbo */}
        <PaymentSelectModal
          open={openPayment}
          cryptoOptions={cryptoOptionsData?.cryptoOptions}
          setOpen={setOpenPayment}
          setWireInstructionsOpen={setWireInstructionsOpen}
          setCryptoPaymentOpen={setCryptoPaymentOpen}
        />
        <KYCModal
          open={open}
          setOpen={setOpen}
          kycTemplateId={kycTemplate.templateId}
          kycTemplateName={kycTemplate.templateName}
          refetch={refetch}
          deal={dealData.deal || {}}
          setShowTaxAsCompleted={setShowTaxAsCompleted}
        />
        <WireInstructionsModal
          investmentWireInstructions={investmentData?.investment?.wire_instructions}
          open={wireInstructionsOpen}
          setOpen={setWireInstructionsOpen}
          docs={docs}
        />

        <React.Suspense fallback={<div>Loading</div>}>
          <CryptoPaymentModalRemote
            open={cryptoPaymentOpen}
            setOpen={setCryptoPaymentOpen}
            deal_name={dealData?.deal?.name ?? dealData?.deal?.company_name}
            deal_id={dealData?.deal?._id}
            investor_name={
              investmentData?.investment?.submissionData?.legalName ||
              investmentData?.investment?.submissionData?.fullName ||
              `${data?.user.first_name} ${data?.user.last_name}`
            }
            investment_amount={
              investmentData ? investmentData.investment.amount : currentInvestment.amount
            }
            investment_id={investmentData ? investmentData.investment._id : currentInvestment._id}
            user_id={data._id}
          />
        </React.Suspense>

        <AllocationsRocket />
        <Confetti className={`confetti ${!confetti && 'hidden'}`} />
      </section>
    </>
  );
}

export default DealNextSteps;
