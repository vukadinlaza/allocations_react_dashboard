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
    cy.findByText(/profile/i).click({ force: true, timeout: 5000 });
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(1) > div > div > input',
    )
      .clear()
      .type('Aaron')
      .should('eq', 'Aaron');
    cy.findByRole('textbox', { name: /last name/i })
      .clear()
      .type('Dennis');
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
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(3) > div:nth-child(2) > div > div > select',
    ).select('Seed');
    cy.findByRole('textbox', { name: /linkedin profile link/i })
      .clear()
      .type('linkedin.com');
    cy.findByRole('button', { name: /save profile/i }).click();
  });
  it('uploads a picture', () => {
    cy.findByText(/profile/i).click({ force: true, timeout: 5000 });
    cy.fixture('cypress.png').then(() => {
      cy.get(
        '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > span > span > div > svg',
      ).click();
      cy.get('[data="upload-avatar"]').attachFile('cypress.png');
    });
    cy.findByText(/submit/i).click();
  });
  it('logs out', () => {
    cy.findByText(/logout/i).click();
    cy.url().should('include', 'https://staging.login.allocations.com/');
  });
});
