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
    cy.findByRole('heading', { name: /fund/i }).click();
    cy.findByRole('heading', { name: /spv/i }).click();
  });
  // it('logs out', () => {
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
