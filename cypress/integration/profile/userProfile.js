/// <reference types="cypress" />

const username = Cypress.env('username');
const password = Cypress.env('password');

describe('User Profile', () => {
  beforeEach(() => {
    cy.loginAuth0(username, password);
    cy.visit('/');
  });
  it('switches to profile', () => {
    cy.findByText(/profile/i).click({ force: true });
    cy.url().should('eq', 'http://localhost:3000/profile');
    cy.findByRole('heading', { name: /personal information/i }).contains('Personal Information');
  });
  it('fills out and saves profile form', () => {
    cy.findByText(/profile/i).click({ force: true });
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(1) > div > div > input',
    )
      .clear()
      .type('Aaron');
    cy.findByRole('textbox', { name: /last name/i })
      .clear()
      .type('Dennis');
    // eslint-disable-next-line no-irregular-whitespace
    cy.findByRole('button', { name: /^(individual)?$/i }).click();
    cy.findByRole('option', { name: /individual/i }).click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(3)',
    )
      .clear()
      .type('Moscow');
    cy.findByRole('combobox', { name: /country of residence/i }).select('United States');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(5) > div > div > select',
    ).select('Idaho');
    cy.findByRole('textbox', { name: /username/i })
      .clear()
      .type('Amdennis87');
    cy.findByRole('textbox', { name: /profile bio/i })
      .clear()
      .type('This is a bio');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > div > div > select',
    ).select('Energy');
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > div > div > select',
    ).select('Food');
    cy.findByRole('textbox', { name: /linkedin profile link/i })
      .clear()
      .type('linkedin.com');
    cy.fixture('cypress.png').then(() => {
      cy.get(
        '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > span > span > div > svg',
      ).click();
      cy.get(
        'body > div:nth-child(9) > div:nth-child(3) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > input',
      ).attachFile('cypress.png');
    });
    cy.findByText(/submit/i).click();
    cy.findByRole('button', { name: /save profile/i }).click();
  });
  it('uploads a picture', () => {
    cy.findByText(/profile/i).click({ force: true, timeout: 5000 });
    cy.fixture('cypress2.jpeg').then(() => {
      cy.get(
        '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > span > span > div > svg',
      ).click();
      cy.get(
        'body > div:nth-child(9) > div:nth-child(3) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > input',
      ).attachFile('cypress2.jpeg');
    });
    cy.findByText(/submit/i).click();
  });
  // it('switches to SPVs', () => {
  //   cy.findByRole('button', { name: /spvs/i }).click({ force: true });
  //   cy.url().should('include', '/deals');
  //   cy.findByRole('button', { name: /portfolio company/i, timeout: 60000 }).contains(
  //     'PORTFOLIO COMPANY',
  //   );
  // });
  // it('switches to profile and back to dashboard', () => {
  //   cy.findByText(/profile/i).click({ force: true });
  //   cy.findByRole('button', { name: /dashboard/i }).click({ force: true });
  //   cy.url().should('eq', 'http://localhost:3000/admin/repair-biotechnologies');
  //   cy.findByRole('button', { name: /create new deal page/i }).contains('Create New Deal Page');
  // });
  // it('selects the dropdown and selects another organization', () => {
  //   cy.findByRole('button', { name: /repair biotechnologies/i }).click();
  //   cy.findByRole('option', { name: /rainmakers/i }).click();
  //   cy.url().should('eq', 'http://localhost:3000/admin/Rainmakers');
  //   cy.findByRole('tab', { name: /all/i }).contains('All');
  // });
  // it('logs out', () => {
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
