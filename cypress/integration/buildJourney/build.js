/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');

describe('Investing Journey', () => {
  beforeEach(() => {
    cy.loginAuth0(username, password);
    cy.updateFeatureFlags({
      'deal-page-redesign': false,
      'build-modals': false,
      'prospect-deal-page': false,
      'capital-calls': false,
      'test-flag-for-demo': false,
      'crypto-payment-in-build': false,
      'fund-manager-banking-tab': false,
      'use-in-app-build': true,
    });
  });
  it('builds a deal through the build form', () => {
    cy.visit('http://localhost:3000');
    cy.findByText(/add/i).click();
    cy.url().should('eq', 'http://localhost:3000/public/new-build');
    // Form
    cy.findByRole('heading', { name: /fund/i }).click();
    cy.findByRole('heading', { name: /spv/i }).click();
    cy.findByRole('heading', { name: /crypto/i }).click({ force: true });
    cy.findByRole('heading', { name: /secondary/i }).click();
    cy.findByRole('heading', { name: /startup/i }).click();
    cy.findByRole('button', { name: /entity/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(4)',
    )
      .find('input')
      .type('Entity')
      .should('have.value', 'Entity');
    cy.findByRole('button', { name: /inc/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(5) > div:nth-child(2) > div:nth-child(1)',
    )
      .find('input')
      .type('Full Name')
      .should('have.value', 'Full Name');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div',
    )
      .find('input')
      .type('Full Title')
      .should('have.value', 'Full Title');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(6) > div',
    )
      .find('input')
      .type('Portfolio Name')
      .should('have.value', 'Portfolio Name');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(7) > div',
    )
      .find('input')
      .type('Deal Name')
      .should('have.value', 'Deal Name');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(8) > div',
    )
      .find('input')
      .clear()
      .type('200000')
      .should('have.value', '2000000');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(9)',
    )
      .find('input')
      .type('2023-12-12')
      .should('have.value', '2023-12-12');
    cy.findByRole('button', { name: /select\.\.\./i }).click();
    cy.findByRole('option', { name: /construction/i }).click();
    cy.findByRole('button', { name: /safe/i }).click();
    cy.findByRole('button', { name: /series a preferred stock/i }).click();
    cy.findByText(/1%/i).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > button:nth-child(5)',
    )
      .contains('Custom')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > div',
    )
      .find('input')
      .type('5')
      .should('have.value', '5');
    cy.findByRole('button', { name: /annual/i }).click();
    cy.findByRole('button', { name: /20%/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > button:nth-child(5)',
    )
      .contains('Custom')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(3)',
    )
      .find('input')
      .type('35')
      .should('have.value', '35');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(4) > div > div:nth-child(2) > button:nth-child(2)',
    )
      .contains('No')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(6) > div > div:nth-child(2) > button:nth-child(1)',
    )
      .contains('Yes')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(6) > div > div:nth-child(2) > button:nth-child(2)',
    )
      .contains('No')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(5) > div',
    )
      .find('input')
      .clear()
      .type(20000)
      .should('have.value', 20000);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > button:nth-child(2)',
    )
      .contains('No')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(3)',
    )
      .find('input')
      .type('Advisor Name')
      .should('have.value', 'Advisor Name');
    cy.findByRole('button', { name: /506c/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > button:nth-child(2)',
    )
      .contains('Custom')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > button:nth-child(1)',
    )
      .contains('Allocations')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(6) > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > button:nth-child(1)',
    )
      .contains('Yes')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(6) > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > button:nth-child(2)',
    )
      .contains('No')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(6) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > button:nth-child(1)',
    )
      .contains('Yes')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(6) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > button:nth-child(2)',
    )
      .contains('No')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > form > div:nth-child(7) > div:nth-child(2) > div > div > div > div:nth-child(2) > div > textarea:nth-child(1)',
    )
      .type('Final Notes')
      .should('have.value', 'Final Notes');
    cy.findByRole('button', { name: /continue/i }).click();
    // Review
    cy.findByRole('heading', { name: /deal name/i }).contains('Deal Name');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div',
    ).contains(
      /^(.*)(((1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2})|((Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}))(.*)/,
    );
    cy.findByRole('heading', { name: /\$2,000,000/i }).contains('$2,000,000');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3)',
    ).contains('1. Basic Information');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)',
    ).contains('2. Deal Terms');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(5)',
    ).contains('3. Offering Terms');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(6)',
    ).contains('4. Compliance');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(7)',
    ).contains('5. Final');
    cy.findByRole('button', { name: /continue/i }).click();
    cy.findByRole('button', { name: /select\.\.\./i }).click();
    cy.findByRole('option', { name: /testingorg/i }).click();
    cy.findByRole('button', { name: /continue/i }).click();
    // Sign Agreement
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div',
    )
      .find('button')
      .contains('Sign Agreement')
      .click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(9000);
    cy.findByRole('button', { name: /i accept/i }).should('be.visible');
    cy.findByRole('button', { name: /i decline/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div',
    )
      .find('button')
      .contains('Sign Agreement')
      .click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(9000);
    cy.findByRole('button', { name: /i accept/i }).click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(12000);
    cy.window().then((win) => {
      cy.spy(win, 'open').as('view-deal');
    });
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)',
    )
      .contains('View')
      .click();
    cy.get('@view-deal').should('be.calledWith', Cypress.sinon.match.string, '_blank');
    // Upload Documents
    cy.findByRole('button', {
      name: /4 upload documents here is where you upload important deal documents/i,
    }).click();
    cy.fixture('javascript_the_good_parts.pdf').then(() => {
      cy.get(
        '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)',
      )
        .find('input')
        .click({ force: true })
        .attachFile('javascript_the_good_parts.pdf');
    });
    cy.fixture('cypress.png').then(() => {
      cy.get(
        '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2)',
      )
        .find('input')
        .click({ force: true })
        .attachFile('cypress.png');
    });
    cy.fixture('javascript_the_good_parts.pdf').then(() => {
      cy.get(
        '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div:nth-child(2)',
      )
        .find('input')
        .click({ force: true })
        .attachFile('javascript_the_good_parts.pdf');
    });
    // Pre Onboarding, Onboarding and Closing
    cy.findByRole('button', {
      name: /5 pre-onboarding here is where we create and structure your deal entities and accounts/i,
    }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)',
    ).contains('SS4 Documents Creation');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)',
    ).contains('Private Fund Docs Creation');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3)',
    ).contains('Creating Bank Account');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(4)',
    ).contains('Deal Page is being prepared by the Allocations Team');
    cy.findByRole('button', {
      name: /6 onboarding here is where we will invite investors to invest into your deal/i,
    }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)',
    ).contains('Ready to Onboard');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)',
    ).contains('Deal Onboarding');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3)',
    ).contains('Onboarding Complete');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(4)',
    ).contains('KYC Review Complete');
    cy.findByRole('button', {
      name: /7 closing this is where we finish up and close your investment round out/i,
    }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)',
    ).contains('Portfolio Company Wire Info Uploaded');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)',
    ).contains('Signed Portfolio Company Docs');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3)',
    ).contains('Wire Sent to Portfolio Company');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(4)',
    ).contains('Blue Sky Fees Filed');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(5)',
    ).contains('Reg D Filing Complete');
  });
  // it('logs out', () => {
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
