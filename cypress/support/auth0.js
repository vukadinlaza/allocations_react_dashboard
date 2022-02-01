/// <reference types="cypress" />

Cypress.Commands.add('loginAuth0', (username, password) => {
  cy.session([username, password], () => {
    cy.log('trying to login');
    cy.visit('/');
    cy.findByRole('textbox', { name: /email/i }).type(username);
    cy.findByPlaceholderText(/your password/i).type(password);
    cy.findByRole('button', { name: /log in/i }).click();
    cy.url().should('eq', 'http://localhost:3000/admin/repair-biotechnologies');
  });
});
