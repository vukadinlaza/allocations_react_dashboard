/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');

describe('Investing Journey', () => {
  beforeEach(() => {
    cy.loginAuth0(username, password);
    cy.visit('/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(6000);
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
  it('visits the deal page', () => {
    cy.visit('http://localhost:3000/deals/allocations/demo-space-x');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(1) > section:nth-child(2) > ul',
    )
      .find('li')
      .first()
      .contains('Signing Deadline');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(1) > section:nth-child(2) > ul',
    )
      .first()
      .contains(
        /^(.*)(((1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2})|((Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}))(.*)/,
      );
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(1) > section:nth-child(2) > ul',
    )
      .find('li')
      .eq(1)
      .contains('Wire Deadline');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(1) > section:nth-child(2) > ul',
    )
      .find('li')
      .eq(1)
      .contains(
        /^(.*)(((1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2})|((Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}))(.*)/,
      );
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(2) > section:nth-child(2)',
    ).contains('Terms');
    const headers = [];
    const termHeaders = [
      'Manager:',
      'Total Carry:',
      'Total Management Fee:',
      'Fee Frequency:',
      'Minimum Investment:',
    ];
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(2) > section:nth-child(2) > ul',
    )
      .find('li > p')
      .each((p) => {
        headers.push(p.text());
      })
      .then(() => {
        expect(headers).to.include.members(termHeaders);
      });
    cy.findByRole('heading', { name: /305 ventures gp llc/i }).contains('305 Ventures GP LLC');
    cy.findByRole('heading', { name: /20%/i }).contains(/1?[1-9]?\d?%/);
    cy.findByRole('heading', { name: /2%/i }).contains(/\d?%/);
    cy.findByRole('heading', { name: /one-time/i }).contains('One-Time' || 'Annual');
    cy.findByRole('heading', { name: /\$5,000/i }).contains(/^\$\d{1,3}(,\d{3})*(\.\d+)?$/);
    cy.findByRole('button', { name: /invest/i }).click();
    cy.url().should('eq', 'http://localhost:3000/invest/allocations/demo-space-x');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(1) > div:nth-child(2)',
    )
      .find('input')
      .click()
      .clear()
      .type('5000')
      .should('have.value', '5,000')
      .clear();
    cy.findByRole('button', { name: /minimum investment/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(1) > div:nth-child(2)',
    )
      .find('input')
      .should('have.value', '5,000.00')
      .clear();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > div > section',
    ).contains('Deal documents');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(4) > div',
    )
      .contains('Terms and Conditions')
      .and('be.visible');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(4) > div > div',
    ).contains(
      'I consent to electronic delivery of all documents, notices and agreements as related to my investment;',
    );
    cy.findByRole('button', { name: /back to deal page/i }).click();
    cy.url().should('include', '/deals/allocations/demo-space-x');
    cy.findByRole('button', { name: /invest/i }).click();
    cy.findByRole('button', { name: /next steps/i }).click();
    cy.url().should('include', '/next-steps/allocations/demo-space-x');
    cy.findByRole('button', { name: /edit investment/i }).click();
    cy.url().should('include', '/invest/allocations/demo-space-x');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(3) > div:nth-child(3)',
    )
      .find('input')
      .click()
      .clear()
      .type('Entity Name')
      .should('have.value', 'Entity Name');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(3) > div:nth-child(2)',
    ).click();
    cy.findByRole('option', { name: /individual/i }).click();
    cy.findByRole('textbox', { name: /country/i }).click();
    cy.findByRole('option', { name: /^United States$/i }).click();
    cy.findByRole('textbox', { name: /state/i }).click();
    cy.findByRole('option', { name: /^Alabama$/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(3) > div:nth-child(6)',
    ).click();
    cy.findByRole('option', {
      name: /My professional certification qualifies me as an accredited investor/,
    }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(4)',
    )
      .find('input')
      .click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(4) > div:nth-child(2) > div > form > div:nth-child(1)',
    )
      .find('input')
      .click()
      .clear()
      .type('Second Signer')
      .should('have.value', 'Second Signer');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(4) > div:nth-child(2) > div > form > div:nth-child(2)',
    )
      .find('input')
      .click()
      .clear()
      .type('second@email.com')
      .should('have.value', 'second@email.com');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(3) > section:nth-child(4) > div:nth-child(2) > div > div',
    )
      .find('input')
      .click();
    cy.findByRole('checkbox', {
      name: /we have read and accept the terms of the investment\./i,
    }).click();
    cy.findByRole('button', { name: /confirm and submit for final agreement review/i }).click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);
    cy.findByTitle(/spv document/i).should('be.visible');
    cy.findByRole('button', { name: /we agree/i }).should('be.visible');
    cy.findByRole('button', { name: /we decline/i }).click();
  });
  // it('logs out', () => {
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
