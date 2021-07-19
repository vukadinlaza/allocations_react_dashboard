import React, { useState } from 'react';
import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import { Col, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import OrganizationMembers from '../../OrganizationMembers';
import './style.scss';

const ORG_SUPERADMIN = gql`
  query GetMembers($slug: String!) {
    organizationMembers(slug: $slug) {
      _id
      name
      email
      investor_type
      first_name
      last_name
    }
    organization(slug: $slug) {
      _id
      name
      adminInvites {
        to
        status
        sent_at
      }
      complianceTasks {
        _id
        completed
        task
        status
      }
      documentTemplates {
        _id
        title
      }
    }
  }
`;

const tabs = [{ id: '0', name: 'Admin Members', Component: OrganizationMembers }];

export default function SuperAdminManager() {
  const { organization } = useParams();
  const { data, error, refetch } = useQuery(ORG_SUPERADMIN, { variables: { slug: organization } });
  const [activeTab, setActiveTab] = useState('0');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <div className="SuperAdminManager">
      <Row>
        <Col sm={{ size: 8, offset: 1 }} style={{ marginBottom: '10px' }}>
          <h4 style={{ paddingBottom: '15px' }}>{_.get(data, 'organization.name')}</h4>
          <Nav tabs>
            {tabs.map((tab) => (
              <NavItem key={tab.id}>
                <NavLink
                  className={classnames({ active: activeTab === tab.id })}
                  onClick={() => {
                    toggle(tab.id);
                  }}
                >
                  {tab.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Col>
      </Row>
      <TabContent activeTab={activeTab}>
        {tabs.map(({ id, Component }) => (
          <TabPane key={id} tabId={id}>
            <Component data={data} error={error} refetch={refetch} />
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}
