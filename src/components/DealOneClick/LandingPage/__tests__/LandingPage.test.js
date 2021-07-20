import React from 'react';
import TestRenderer from 'react-test-renderer';
import MockAllocationsProvider from '../../../utils/test/test-utils';
import LandingPage, { GET_DEAL } from '../LandingPage';
import DealHeader from '../DealHeader';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useParams: () => ({
    organization: '305-ventures',
    deal_slug: '305-ventures',
  }),
  useLocation: () => ({
    pathname: jest.fn(),
  }),
}));

describe('LandingPage', () => {
  it('should render LandingPage Component', async () => {
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
        <LandingPage />
      </MockAllocationsProvider>,
    );

    const containerTree = container.toTree();

    const testInstance = container.root;
    expect(containerTree.props.path).toMatch('/deals/305-ventures/305-ventures');
    expect(testInstance.findByType(LandingPage)).toBeTruthy();
  });

  describe('DealHeader', () => {
    it('should render DealHeader', async () => {
      const deal = {
        company_name: '305 Ventures',
        company_description: 'Test Descriptions',
        slug: '305',
        dealCoverImageKey: 'image',
      };

      const container = TestRenderer.create(
        <MockAllocationsProvider>
          <DealHeader deal={deal} />
        </MockAllocationsProvider>,
      );

      const testInstance = container.root;

      expect(testInstance.findByType(DealHeader)).toBeTruthy();

      expect(
        testInstance
          .findByType(DealHeader)
          .children[0].findByType('section')
          .children[0].findByType('h1').children,
      ).toContain(deal.company_name);
    });
  });
});
