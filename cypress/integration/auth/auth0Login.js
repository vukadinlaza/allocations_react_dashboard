/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');
const audience = Cypress.env('audience');
const scope = Cypress.env('scope');
const client_id = Cypress.env('client_id');
const client_secret = Cypress.env('client_secret');
const localStorageKey = Cypress.env('localStorageKey');
const auth0Domain = Cypress.env('auth0Domain');

describe('Auth', () => {
  it('Should log in', () => {
    cy.log('lets log in');

    cy.request({
      method: 'POST',
      url: auth0Domain,
      body: {
        grant_type: 'password',
        username,
        password,
        audience,
        scope,
        client_id,
        client_secret,
      },
    }).then(({ body: { access_token, expires_in, id_token, token_type } }) => {
      cy.window().then(() => {
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            body: {
              client_id,
              access_token,
              id_token,
              scope,
              expires_in,
              token_type,
              decodedToken: {
                user: JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString('ascii')),
              },
              audience,
            },
            expiresAt: Math.floor(Date.now() / 1000) + expires_in,
          }),
        );
      });
      cy.visit('http://localhost:3000');
    });

    // cy.log('after req');
    // cy.visit('/');
    // cy.wait(5000);
    cy.get('[alt="allocations"]').should('be.visible');
  });
});
