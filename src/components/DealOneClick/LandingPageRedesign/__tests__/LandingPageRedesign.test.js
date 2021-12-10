import React from 'react';
import TestRenderer from 'react-test-renderer';
import MockAllocationsProvider from '../../../utils/test/test-utils';
import LandingPageRedesign, { GET_DEAL } from '../LandingPageRedesign';
import DealHeader from '../DealHeader';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    organization: '305-ventures',
    deal_slug: '305-ventures',
  }),
  useLocation: () => ({
    pathname: jest.fn(),
  }),
}));

describe('LandingPageRedesign', () => {
  it('should render LandingPageRedesign Component', async () => {
    const mocks = [
      {
        request: {
          query: GET_DEAL,
          variables: {
            deal_slug: '305-ventures',
            fund_slug: '305-ventures',
          },
        },
        result: {
          publicDeal: {
            slug: '305-ventures',
            company_name: '305 Ventures',
            docSpringTemplateId: 'tpl_RrmjKbpFRr7qhKY3dD',
          },
        },
      },
    ];

    const container = TestRenderer.create(
      <MockAllocationsProvider path="/deals/305-ventures/305-ventures" mocks={mocks}>
        <LandingPageRedesign />
      </MockAllocationsProvider>,
    );

    const containerTree = container.toTree();
    const testInstance = container.root;

    expect(containerTree.props.path).toMatch('/deals/305-ventures/305-ventures');
    expect(testInstance.findByType(LandingPageRedesign)).toBeTruthy();
  });

  describe('DealHeader', () => {
    it('should render DealHeader', async () => {
      const deal = {
        company_name: '305 Ventures',
        company_description: 'Test Descriptions',
        slug: '305',
        dealCoverImageKey: 'test-image-allocations',
        dealParams: { wireDeadline: '2021-07-09T17:00', signDeadline: '2021-07-09T17:00' },
      };

      const container = TestRenderer.create(
        <MockAllocationsProvider>
          <DealHeader deal={deal} />
        </MockAllocationsProvider>,
      );

      const testInstance = container.root;

      expect(testInstance.findByType(DealHeader)).toBeTruthy();
    });
  });
});
