import React from 'react'
import { Paper } from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

export default function Faq () {
  return (
    <div className="Faq">
      <div className="Faq-title">Frequently Asked Questions</div>
      <Paper className="Faq-entry">
        <h5>What is an SPV?</h5>
        <div>
          An SPV is a special purpose vehicle commonly used for group investment. It is a fenced organization having limited predefined purposes and a legal personality mainly used for a one off investment. 
          &nbsp;<a href="https://www.investopedia.com/terms/s/spv.asp">More Information</a>
        </div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>How do I get paid out from the SPV upon acquisition / IPO / sale?</h5>
        <div>You are investing in a USA Series LLC which is investing in the portfolio company.</div>
      </Paper>
      {/**<Paper className="Faq-entry">
        <h5>Can I adjust my pledge?</h5>
        <div></div>
      </Paper>**/}
      <Paper className="Faq-entry">
        <h5>What do I need to sign?</h5>
        <div>
          You will receive a DocuSign SPV contract with the following documents in one agreement
          <ul>
            <li>Private Placement Memorandum</li>
            <li>Operating Agreement</li>
            <li>Subscription Agreement</li>
          </ul>
        </div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>What is the process for wiring with crypto?</h5>
        <div>We accept stablecoins including TUSD, USDC and USDT. Needs to be settled within 10 mins of quoting</div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>What are the fees for wiring with crypto?</h5>
        <div>We use QCP brokerage for crypto wires, who charge a 0.5%-1% fee inclusive of their costs + wire fee.</div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>How does tax work for these investments?</h5>
        <div>
          <ul>
            <li>
              Each investor in the SPV will be required to complete one of the following tax forms within a few weeks after investing
              <ul>
                <li><a href="https://www.irs.gov/pub/irs-pdf/fw9.pdf" target="_blank">W9 (US Persons)</a></li>
                <li><a href="https://www.irs.gov/pub/irs-pdf/fw8ben.pdf">W8-BEN (non-USA individuals)</a></li>
                <li><a href="https://www.irs.gov/pub/irs-pdf/fw8bene.pdf">W8-BENE (non-USA entities)</a></li>
              </ul>
            </li>
            <li>
              The capital gains tax accrued on the investment will be subject to tax depending on your tax residence. These will be calculated at the time of disposal of the asset
            </li>
            <li>
              You will also receive a tax package that includes either a 2019 K-1 or an estimate for all investments requiring a K-1 in 2019
            </li>
          </ul>
        </div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>What are the expenses on the SPV?</h5>
        <div>The SPV may retain amounts contributed by the subscribers toward expenses of the SPV including but not limited to: entity formation, deal setup, investor onboarding, tax returns, Schedule K-1 preparation, regulatory expenses, brokerage fees, bluesky filing, liquidating the SPV, amendments to documents for the SPV, attorney / accountant fees and disbursements</div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>Am I directly investing in the portfolio company?</h5>
        <div>You are investing in a fund investing in the company, not directly in the company. You do not have direct investor rights (e.g. can't contact the company directly and may not be able to participate in future rounds)</div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>Have you done due diligence on the company?</h5>
        <div>I understand that I must do my own diligence, read the investment documents and ask any questions I think are relevant to my investment decision. Company information on the site is incomplete and has not been verified. The SPV organizer and advisor may not have done any diligence on the company. Investing with notable investors doesn't guarantee any level of diligence has been performed</div>
      </Paper>
      {/**<Paper className="Faq-entry">
        <h5>Upon signing, does this guarantee my investment?</h5>
        <div>...</div>
      </Paper>**/}
      <Paper className="Faq-entry">
        <h5>How is the SPV governed?</h5>
        <div>When direct investors in the company must vote or give legal approval, the SPV organiser will make decisions on behalf of the fund. The SPV organiser will generally vote in line with the company management, or majority shareholders of the company. We will not consult you and other investors in making decisions on behalf of the fund</div>
      </Paper>
      <Paper className="Faq-entry">
        <h5>What are some of the risks associated with the investment?</h5>
        <div>While venture capital investments offer the opportunity for significant gains, those investments also involve a high degree of business and financial risk and can result in substantial losses.
          Among others, such risks may also include the following:
          <ul>
            <li>The portfolio company’s products and services are subject to the risks associated with new and rapidly evolving technologies</li>
            <li>The space industry is emerging and may not receive widespread market acceptance</li>
            <li>The portfolio company requires significant upfront cost and will need to attract investors</li>
            <li>The portfolio company does not expect to be profitable for the foreseeable future</li>
            <li>The research is new and unproven and may not lead to successful commercial products</li>
            <li>The portfolio company is an early-stage company with an unproven business strategy and may never achieve commercialization or profitability</li>
            <li>Competitors could outcompete the portfolio company on price</li>
            <li>Regulations could change preventing the portfolio company from successfully launchin</li>
            <li>The portfolio company could experience collisions with asteroids, leading to extensive loss of capital</li>
          </ul>
        </div>
      </Paper>
    </div>
  )
}