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
  it('switches to profile and back to dashboard', () => {
    cy.findByText(/profile/i).click({ force: true });
    cy.findByRole('button', { name: /dashboard/i }).click({ force: true });
    cy.url().should('eq', 'http://localhost:3000/admin/perpetual-vp');
    cy.findByRole('button', { name: /create new deal page/i }).contains('Create New Deal Page');
  });
  it('selects the dropdown and selects another organization', () => {
    cy.findByRole('button', { name: /perpetual value partners/i }).click();
    cy.findByRole('option', { name: /rainmakers/i }).click();
    cy.url().should('eq', 'http://localhost:3000/admin/Rainmakers');
  });
  it('resizes the window and opens hamburger menu', () => {
    let resizeEventFired = false;
    cy.window().then((win) => {
      win.addEventListener('resize', () => {
        resizeEventFired = true;
      });
    });
    cy.viewport(414, 896);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);
    cy.wrap().should(() => {
      expect(resizeEventFired).to.eq(true);
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);
    cy.findByRole('button', { name: /open drawer/i }).click();
    cy.findByRole('button', { name: /profile/i }).click();
    cy.url().should('eq', 'http://localhost:3000/profile');
    cy.viewport(1440, 1080);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  // it('logs out', () => {
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
