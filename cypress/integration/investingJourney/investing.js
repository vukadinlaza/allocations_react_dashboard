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
  });
  it('logs out', () => {
    cy.findByText(/logout/i).click();
    cy.url().should('include', 'https://staging.login.allocations.com/');
  });
});
