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
    cy.get('table > tbody').find('tr').first().contains('Space X');
    cy.get('[data="table-sort"]').first().click({ force: true }).click();
    cy.get('table > tbody').find('tr').first().should('not.contain', 'Space X');
    cy.get('table > tbody').find('tr').first().contains('The Ticket Fairy SPV');
  });
  it('opens the actions menu', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('tab', { name: /investments/i }).click();
    cy.get('[data="actions-menu"]').first().click();
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > div > div',
    ).contains('Documents');
    cy.findByRole('menu')
      .find('li')
      .then((item) => {
        return item.length;
      })
      .should('eq', 3);
  });
  it('visits the Deal Page in the action menu', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('tab', { name: /investments/i }).click();
    cy.get('[data="actions-menu"]').first().click();
    cy.window().then((win) => {
      cy.spy(win, 'open').as('deal-page');
    });
    cy.findByRole('menuitem', { name: /deal page/i }).click();
    cy.get('@deal-page').should(
      'be.calledWith',
      '/deals/allocations/demo-space-x',
      '_blank',
      'noopener,noreferrer',
    );
    cy.visit('http://localhost:3000/deals/allocations/demo-space-x');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('heading', { name: /space x/i }).contains('Space X');
  });
  it('visits the Next Steps in the action menu', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('tab', { name: /investments/i }).click();
    cy.get('[data="actions-menu"]').first().click();
    cy.window().then((win) => {
      cy.spy(win, 'open').as('next-steps');
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('menuitem', { name: /next steps/i }).click();
    cy.get('@next-steps').should(
      'be.calledWith',
      '/next-steps/allocations/demo-space-x?investmentId=61fd7417aaca22067d0daf45',
      '_blank',
      'noopener,noreferrer',
    );
    cy.visit(
      'http://localhost:3000/next-steps/allocations/demo-space-x?investmentId=61fd7417aaca22067d0daf45',
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('heading', { name: /next steps/i }).should('be.visible');
    cy.get('#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(2)')
      .find('.action-item')
      .then((item) => {
        return item.length;
      })
      .should('eq', 5);
    const headers = [];
    const pageHeaders = [
      'Edit Investment',
      'Sign for Investment',
      'Submit Tax Information',
      'Accredited Investor Status',
      'Make Wire Payment',
    ];
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(2) > .action-item > .action-instructions',
    )
      .find('.action-header')
      .each((p) => {
        headers.push(p.text());
      })
      .then(() => {
        expect(headers).to.include.members(pageHeaders);
      });
    cy.findByRole('button', { name: /edit investment/i }).click();
    cy.url().should('eq', 'http://localhost:3000/invest/allocations/demo-space-x');
    cy.visit(
      'http://localhost:3000/next-steps/allocations/demo-space-x?investmentId=61fd7417aaca22067d0daf45',
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('link', { name: /add new investment/i }).click();
    cy.url().should('eq', 'http://localhost:3000/deals/allocations/demo-space-x');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.visit(
      'http://localhost:3000/next-steps/allocations/demo-space-x?investmentId=61fd7417aaca22067d0daf45',
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('button', { name: /view wire instructions/i }).click();
    cy.get('.wire-doc-iframe').invoke('attr', 'style', 'opacity: 1');
    cy.get('.embed-responsive-item').invoke('attr', 'style', 'opacity: 1').should('be.visible');
    cy.findByRole('button').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.window().then((win) => {
      cy.spy(win, 'open').as('accredited-investor');
    });
    cy.get(
      '#root > div:nth-child(2) > div:nth-child(2) > section > div:nth-child(2) > div:nth-child(4) > button',
    ).click();
    cy.get('@accredited-investor').should(
      'be.calledWith',
      'https://bridge.parallelmarkets.com/allocations',
      '_blank',
    );
  });
  it('searches, sorts and views documents', () => {
    cy.findByRole('button', { name: /repair biotechnologies/i }).click();
    cy.findByRole('option', { name: /Aaron Dennis/i }).click();
    cy.url().should('eq', 'http://localhost:3000/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('tab', { name: /documents/i }).click();
    cy.get('table > tbody')
      .find('tr')
      .then((row) => {
        return row.length;
      })
      .should('eq', 3);
    cy.findByRole('textbox', { name: /search/i })
      .clear()
      .type('Space X');
    cy.findByRole('textbox', { name: /search/i }).should('have.value', 'Space X');
    cy.get('table > tbody')
      .find('tr')
      .then((row) => {
        return row.length;
      })
      .should('eq', 2);
    cy.findByRole('textbox', { name: /search/i }).clear();
    cy.get('table > tbody').find('tr').first().contains('1626712391797-Demo Investment Agreement');
    cy.get('[data="table-sort"]').first().click({ force: true }).click();
    cy.get('table > tbody')
      .find('tr')
      .first()
      .should('not.contain', '1626712391797-Demo Investment Agreement');
    cy.get('table > tbody')
      .find('tr')
      .first()
      .contains('1641262052720-Lance test template MDampAM');
    cy.get('[data="actions-menu"]').first().click();
    cy.window().then((win) => {
      cy.spy(win, 'open').as('view-documents');
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.findByRole('menuitem', { name: /view document/i }).click();
    cy.get('@view-documents')
      .should('have.been.called')
      .and('be.calledWith', Cypress.sinon.match.string, '_blank', 'noopener,noreferrer');
  });
  // it('logs out', () => {
  //   cy.findByText(/logout/i).click();
  //   cy.url().should('include', 'https://staging.login.allocations.com/');
  // });
});
