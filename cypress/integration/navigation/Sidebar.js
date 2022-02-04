/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');

describe('Sidebar Menu', () => {
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
  it('switches to profile', () => {
    cy.findByText(/profile/i).click();
    cy.url().should('eq', 'http://localhost:3000/profile');
    cy.findByRole('heading', { name: /personal information/i }).contains('Personal Information');
  });
  it('switches to SPVs', () => {
    cy.findByRole('button', { name: /spvs/i }).click({ force: true });
    cy.url().should('include', '/deals');
    cy.findByRole('button', { name: /portfolio company/i, timeout: 60000 }).contains(
      'PORTFOLIO COMPANY',
    );
  });
  it('switches to profile and back to dashboard', () => {
    cy.findByText(/profile/i).click({ force: true });
    cy.findByRole('button', { name: /dashboard/i }).click({ force: true });
    cy.url().should('eq', 'http://localhost:3000/admin/repair-biotechnologies');
    cy.findByRole('button', { name: /create new deal page/i }).contains('Create New Deal Page');
  });
  it('selects the dropdown and selects another organization', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /rainmakers/i }).click();
    cy.url().should('eq', 'http://localhost:3000/admin/Rainmakers');
    cy.findByRole('tab', { name: /all/i }).contains('All');
  });
  it('resizes the window', () => {
    let resizeEventFired = false;
    cy.window().then((win) => {
      win.addEventListener('resize', () => {
        resizeEventFired = true;
      });
    });

    cy.viewport(414, 896);
    cy.wrap().should(() => {
      expect(resizeEventFired).to.eq(true);
    });
  });
  it('logs out', () => {
    cy.findByText(/logout/i).click();
    cy.url().should('include', 'https://staging.login.allocations.com/');
  });
});
