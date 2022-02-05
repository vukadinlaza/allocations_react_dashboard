/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');

describe('Investor Dashboard', () => {
  beforeEach(() => {
    cy.loginAuth0(username, password);
    cy.visit('/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(6000);
    cy.updateFeatureFlags({
      'deal-page-redesign': true,
      'build-modals': false,
      'prospect-deal-page': false,
      'capital-calls': false,
      'test-flag-for-demo': false,
      'crypto-payment-in-build': false,
      'fund-manager-banking-tab': false,
      'use-in-app-build': true,
    });
  });
  it('checks if investor highlights exist in the correct formats', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1)',
    )
      .contains('Portfolio Value')
      .should('be.visible');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div',
    ).contains(/^\$\d{1,3}(,\d{3})*(\.\d+)?$/);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1)',
    )
      .contains('Total Invested')
      .should('be.visible');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div',
    ).contains(/^\$\d{1,3}(,\d{3})*(\.\d+)?$/);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(1)',
    )
      .contains('Estimated Multiple')
      .should('be.visible');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2)',
    ).contains(/^(?:[1-9]\.\d{2}|[1-8]\d\.\d{2}|9[0-8]\.\d{2}|99.00)x$/);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > canvas',
    ).should('be.visible');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(5) > div > div:nth-child(2) > canvas',
    ).should('be.visible');
  });
  it('navigates tabs', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('tab', { name: /investments/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1)',
    ).contains('Search');
    cy.findByText(/highlights/i).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1)',
    ).contains('Portfolio Value');
    cy.findByRole('tab', { name: /documents/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1)',
    ).contains('Search');
  });
  it('searches and sorts investments', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('tab', { name: /investments/i }).click();
    cy.get('table > tbody')
      .find('tr')
      .then((row) => {
        return row.length;
      })
      .should('eq', 4);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1)',
    )
      .clear()
      .type('Space X');
    cy.get('table > tbody')
      .find('tr')
      .then((row) => {
        return row.length;
      })
      .should('eq', 2);
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1)',
    ).clear();
  });
  it('logs out', () => {
    cy.findByText(/logout/i).click();
    cy.url().should('include', 'https://staging.login.allocations.com/');
  });
});
