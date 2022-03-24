/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');

describe('Login', () => {
  it('logs in', () => {
    cy.loginAuth0(username, password);
    cy.visit('/');
    cy.url().should('eq', 'http://localhost:3000/admin/perpetual-vp');
  });
  // it('logs out', () => {
  //   cy.loginAuth0(username, password);
  //   cy.visit('/');
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
