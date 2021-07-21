import React from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Utils from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';
import Deal, { GET_INVESTOR_DEAL, CREATE_INVESTMENT } from '.';

import { MockAllocationsProvider, wait } from '../../test';

const mocks = [
  {
    request: {
      query: GET_INVESTOR_DEAL,
      variables: {
        fund_slug: 'allocations',
      },
    },
    result: {
      data: {
        investor: {
          _id: '2439i309tue0r',
          name: 'Frodo Baggins',
          first_name: 'Frodo',
          last_name: 'Baggins',
          entity_name: null,
          country: 'United States of America',
          investor_type: 'individual',
          signer_full_name: 'Frodo Baggins',
          accredited_investor_status: 'I have over $1m-$2m in net assets, excluding my primary residence',
          email: 'frodo@shire.net',
          invitedDeal: {
            _id: 'woet8ueroeitjoetj',
            company_name: 'Shire Fireworks Inc',
            company_description: 'New age fireworks for birthday parties',
            date_closed: '5/30/20',
            deal_lead: 'Gandolf',
            pledge_link: 'https://google.com',
            onboarding_link:
              'https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=a24bcfd2-755c-4ce7-8d3d-bac1b2eccac0&env=na3-eu1&acct=97ababd0-ed90-438a-a2c7-7162a7aa3d64',
            status: 'onboarding',
            memo: 'long deal description',
            documents: [{ link: 'https://google.com', path: '/' }],
            investment: {
              _id: 'w4o8ut3o5ijeotrg',
              amount: '10000',
              status: 'pledged',
            },
            dealParams: {
              totalRoundSize: '1500000',
              allocation: '30',
              totalCarry: '10',
              minimumInvestment: '5000',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_INVESTMENT,
      variables: {
        investment: { deal_id: 'sgdfnkgdfjng', user_id: 'woreuhrekjn' },
      },
    },
    result: {
      data: {
        createInvestor: {
          _id: 'swoirhjgekdfjndkj',
        },
      },
    },
  },
];

jest.mock('../../react-auth0-spa');

it('private Deal Page renders', async () => {
  const { container } = render(
    <MockAllocationsProvider path="/deals/shire-fireworks-inc" mocks={mocks}>
      <Deal />
    </MockAllocationsProvider>,
  );

  await wait();
  expect(container.querySelector('.deal-header').textContent).toMatch('Shire Fireworks Inc');
});
