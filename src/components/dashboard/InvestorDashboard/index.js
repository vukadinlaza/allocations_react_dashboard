/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { List, Typography } from '@allocations/design-system';
import { getMomentFromId } from '@allocations/nextjs-common';
import { useAuth } from '../../../auth/useAuth';
import 'chartjs-plugin-datalabels';
import styles from './styles';
import AllocationsLoader from '../../utils/AllocationsLoader';
import { useFetch } from '../../../utils/hooks';
import InvestmentsList from './InvestmentsList';
import InvestorCharts from './InvestorCharts';
import InvestorHighlights from './InvestorHighlights';
import FundsInvestments from './FundsInvestments';
import ResignModal from './ResignModal';
import CapitalAccountsModal from './CapitalAccountsModal';

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
      documents
      organizations_admin {
        _id
        slug
        name
        logo
      }
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
        submissionData {
          submissionId
        }
        deal {
          _id
          slug
          company_name
          company_description
          date_closed
          status
          investmentType
          deal_lead
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
      invitedDeals {
        _id
        slug
        company_name
        company_description
        date_closed
        status
        organization {
          _id
          slug
        }
      }
    }
  }
`;

const OPS_ACCOUNTING = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const UserHome = ({ classes }) => {
  const { userProfile, loading, refetch } = useAuth(GET_INVESTOR);
  const [resignInvestment, showResignInvestment] = useState(false);
  const [showCapitalAccounts, setShowCapitalAccounts] = useState(false);
  const [userFunds, setUserFunds] = useState([]);
  const [dealsData, setDealsData] = useState({});
  const [funds, setFunds] = useState([]);
  const [fundInvestments, setFundInvestments] = useState({});
  const userInvestments = useMemo(
    () =>
      userProfile.investments?.map((investment) => ({
        _id: investment._id,
        amount: investment.amount,
        type: investment.deal?.investmentType,
        dealName: investment.deal?.company_name,
        dealMultiple: investment.deal?.dealParams?.dealMultiple || 1,
        dealStatus: investment.deal?.status,
        investmentDate: getMomentFromId(investment._id).format('MM/DD/YYYY'),
        metadata: {
          dealSlug: investment.deal?.slug,
          orgSlug: investment.deal?.organization?.slug,
          dealId: investment.deal?._id,
          submissionId: investment.submissionData?.submissionId,
          documents: investment.documents,
        },
      })) || [],
    [userProfile],
  );

  useEffect(() => {
    if (!loading) {
      const dealsIds = [];
      const funds = userProfile?.investments
        ?.filter((investment) => {
          if (
            dealsIds.includes(investment?.deal?._id) ||
            investment?.deal?.investmentType !== 'fund' ||
            !investment?.deal?._id
          )
            return false;
          dealsIds.push(investment.deal._id);
          return true;
        })
        .map((investment) => {
          return investment.deal;
        });
      setUserFunds(funds);
    }
  }, [loading]);

  const createDealsATFilter = () => {
    if (!userFunds.length) return `({Deal Name}="Invalid deal")`;
    const dealsFilters = userFunds
      .map((fund) => `({Deal Name}="${encodeURIComponent(fund.company_name || 'Invalid name')}")`)
      .join(', ');

    return `OR(${dealsFilters})`;
  };

  const createInvestmentsATFilter = () => {
    if (!userFunds.length) return `(FIND("No Funds found", {Deals}))`;
    const fundsFilters = userFunds
      .map((fund) => `FIND("${encodeURIComponent(fund.company_name || 'Invalid name')}" , {Deals})`)
      .join(', ');

    return `OR(${fundsFilters})`;
  };

  const { data: atDeal } = useFetch(
    OPS_ACCOUNTING,
    userFunds?.length && DEALS_TABLE,
    userFunds?.length && createDealsATFilter(),
  );

  const { data: atFundData } = useFetch(
    OPS_ACCOUNTING,
    Object.keys(dealsData)?.length && INVESTMENTS_TABLE,
    Object.keys(dealsData)?.length && createInvestmentsATFilter(),
  );

  useEffect(() => {
    if (atDeal?.length) {
      const dealsData = {};
      atDeal.forEach((deal) => (dealsData[deal.fields['Deal Name']] = deal.id));
      setDealsData(dealsData);
    }
  }, [atDeal]);

  useEffect(() => {
    if (atFundData?.length) {
      const funds = userFunds.map((deal) => {
        const dealInvestments = atFundData
          .filter((investment) => investment.fields.Deals.includes(dealsData[deal.company_name]))
          .map((investment) => {
            return { ...investment.fields, createdTime: investment.createdTime };
          });
        const AUM = dealInvestments.map((inv) => inv.Invested).reduce((acc, n) => acc + n, 0);
        return { ...deal, investments: dealInvestments, AUM };
      });
      setFunds(funds);
    }
  }, [atFundData]);

  const showInvestments = (dealId) => {
    if (!dealId) {
      setFundInvestments({});
    } else {
      console.log({ funds, dealId });
      const fund = funds.find((f) => f._id === dealId);
      setFundInvestments(fund);
    }
  };

  if (!Object.keys(userProfile).length || loading) return <AllocationsLoader fullHeight />;
  console.log({ fundInvestments });
  return (
    <Grid container spacing={2} className={classes.mainContainer}>
      {fundInvestments && Object.keys(fundInvestments).length ? (
        <FundsInvestments
          classes={classes}
          fundInvestments={fundInvestments.investments}
          showInvestments={showInvestments}
          dealName={fundInvestments.company_name}
        />
      ) : (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={1} />
            <Grid
              item
              xs={10}
              container
              spacing={2}
              className={classes.titleContainer}
              alignItems="center"
            >
              <Grid item xs={12} lg={8}>
                <Typography
                  component="div"
                  content="Investor Dashboard"
                  fontWeight={700}
                  variant="heading2"
                />
              </Grid>
              <Grid item xs={12} lg={4} className={classes.buttonsContainer} />
            </Grid>
            <Grid item xs={1} />
          </Grid>
          <InvestorHighlights classes={classes} userInvestments={userInvestments} />
          <InvestorCharts classes={classes} userInvestments={userInvestments} />
          <InvestmentsList
            classes={classes}
            userInvestments={userInvestments}
            showInvestments={showInvestments}
            fundInvestments={fundInvestments}
            showResignInvestment={showResignInvestment}
            userProfile={userProfile}
            setShowCapitalAccounts={setShowCapitalAccounts}
          />
        </Grid>
      )}
      {showCapitalAccounts && (
        <CapitalAccountsModal
          setShowCapitalAccounts={setShowCapitalAccounts}
          showCapitalAccounts={showCapitalAccounts}
          refetch={refetch}
        />
      )}
      <ResignModal
        showResignModal={resignInvestment}
        setShowResignModal={showResignInvestment}
        refetch={refetch}
      />
    </Grid>
  );
};

export default withStyles(styles)(UserHome);
