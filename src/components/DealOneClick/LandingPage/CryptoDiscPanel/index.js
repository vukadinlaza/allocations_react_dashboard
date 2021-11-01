import React from 'react';
import { Box } from '@material-ui/core';
import './styles.scss';

function CryptoDisclosure({ deal }) {
  const { company_name, memo } = deal;

  return (
    <section className="CryptoDisclosure">
      <p className="section-label">Legal Crypto Disclosure</p>
      <Box className="content" p={3}>
        <b>ALLOCATIONS, INC. CRYPTOCURRENCY DEPOSIT DISCLOSURE</b>
        <p />
        <p>
          The Fund Administrator, Allocations, Inc., is not a Money Service Business and therefore,
          cannot directly process deposits made in the form of Cryptocurrency. Deposits made in
          Cryptocurrency shall be processed by a third party, LIMITLEX PRO OÜ, (“ForumPay”) a
          private limited liability company organized and existing under the laws of the Republic of
          Estonia, registry code 14905615. ForumPay is a separate legal entity and not affiliated
          with Allocations, Inc., through common ownership. Virtual currency is not legal tender,
          and is not backed by the government. Your Crypto Assets are not insured or guaranteed by
          the FDIC, Securities Investor Protection Corporation (SIPC) or any other public or private
          insurer, including against cyber theft or theft by other means. The transfer, purchase and
          sale of cryptocurrency is irrevocable. The nature of cryptocurrency may lead to an
          increased risk of fraud or cyber-attack and your cryptocurrency value may be irretrievably
          stolen. Legislative and regulatory changes or actions at the state, federal, or
          international level may adversely affect the use, transfer, exchange and value of virtual
          currency. Some virtual currency transactions shall be deemed to be made when recorded on
          the public ledger, which is not necessarily the date or time the customer initiates the
          transaction. We reserve the right to not process, to cancel or, to the extent possible, to
          reverse a transaction, if (i) we believe that the transaction relates to any Restricted
          Activities, (ii) we believe the transaction involves money laundering, terrorist
          financing, fraud or any other type of crime or (iii) in response to a subpoena, court
          order, or other government order. In such instances, regardless of the reason we have
          blocked, cancelled or reversed your transaction and regardless of the reason we have
          lifted or reversed that restriction, we do not guarantee you will be able to reinitiate
          your transaction at the same price or on the same terms as the transaction that we did not
          process, or that was cancelled or reversed.
        </p>

        <b>Transaction Limits</b>
        <p />
        <p>$50,000 per transaction.</p>

        <p>We may change the above limits for safety, security or other lawful reasons.</p>
      </Box>
    </section>
  );
}

export default CryptoDisclosure;
