import React, { useEffect } from 'react';
// import _ from 'lodash';
// import { Link, useParams } from 'react-router-dom';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import { useAuth } from '../../auth/useAuth';
// import { nWithCommas } from '../../utils/numbers';
// import Loader from '../utils/Loader';
import ServerTable from '../utils/ServerTable';
import linkedinActive from '../../assets/linkedin-active.svg';
import linkedinInactive from '../../assets/linkedin-inactive.svg';
import { Avatar } from '@material-ui/core';
import './style.scss';

/** *
 *
 * All investors in table view for superadmins
 *
 * */

const investorVariables = {
  gqlQuery: `
    query AllUsersWithSubmissionData($pagination: PaginationInput!) {
      allUsersWithSubmissionData(pagination: $pagination) {
        count
        users {
          _id
          first_name
          last_name
          email
          entity_name
          investmentsCount
          investments{
            _id
            amount
            organization
            submissionData{
              country
              state
              fullName
              legalName
            }
          }
          linkedinUrl
          city
          state
          country
          profileImageKey
          sectors
        }
      }
    }`,
  headers: [
    {
      value: 'first_name',
      label: 'NAME',
      type: 'name',
      isFilter: true,
      isSortable: true,
      keyNotInData: true,
    },
    {
      value: 'location',
      label: 'LOCATION',
      type: 'location',
      isSortable: true,
      keyNotInData: true,
    },
    {
      value: 'investmentsCount',
      label: 'INVESTMENTS',
      type: 'investmentsCount',
      align: 'center',
      alignHeader: true,
    },
    {
      value: 'sectors',
      label: 'SECTORS',
      type: 'sectors',
    },
    {
      value: 'linkedinUrl',
      label: 'LINKEDIN',
      type: 'linkedin',
      align: 'center',
      alignHeader: true,
    },
  ],
  resolverName: 'allUsersWithSubmissionData',
  dataVariable: 'users',
  defaultSortField: 'investmentsCount',
};

export default function Investors() {
  // const { organization } = useParams();
  // const { userProfile } = useAuth();
  // const [getInvestors, { data, error }] = useLazyQuery(GET_INVESTORS, {
  //   variables: { slug: organization },
  // });

  // useEffect(() => {
  //   if (userProfile && userProfile.email) getInvestors();
  // }, [getInvestors, userProfile]);

  // if (error) return <div>{error.message}</div>;

  // if (!data?.organization?.investors) return <Loader />;

  // const {
  //   organization: { investors },
  // } = data;

  const displayName = (data) => {
    console.log('data. :>> ', data);
    let name = null;
    if (data.first_name) {
      if (data.last_name) {
        return (name = `${data.first_name} ${data.last_name}`);
      }
      return (name = data.first_name);
    }

    if (data.investments.length >= 1 && data.investments[0].submissionData) {
      const legalName =
        data.investments[0].submissionData.legalName &&
        data.investments[0].submissionData.legalName;
      const fullName =
        data.investments[0].submissionData.fullName && data.investments[0].submissionData.fullName;

      return (name = legalName || fullName);
    }
    return (
      <>
        <Avatar alt={{ name }} />
      </>
    );
    // return name || data.email;
  };

  const displayLocation = (data) => {
    let location = null;
    if (!data.city && !data.country) {
      if (data.investments.length >= 1 && data.investments[0].submissionData) {
        const { submissionData } = data.investments[0];
        return (location =
          submissionData.country !== 'United States'
            ? submissionData.country
            : `${submissionData.state}, ${submissionData.country}`);
      }
    }

    if (data.country) {
      if (data.state && data.city) {
        return (location = `${data.city}, ${data.state}, ${data.country}}`);
      }
      if (data.city) {
        return (location = `${data.city}, ${data.country}`);
      }
      return (location = data.country);
    }

    return location;
  };

  const getCellContent = (type, row, headerValue) => {
    // console.log('Row', row.investments?.[0]?.submissionData?.fullName);
    // row.investments[0].submissionData.fullName
    // row?.investments?.[0]?.submissionData?.fullName
    switch (type) {
      // eventually add profile photos?
      case 'name':
        return displayName(row);

      case 'location':
        return displayLocation(row);

      case 'investmentsCount':
        return <div>{row.investments && row.investments.length}</div>;

      case 'linkedin':
        return row[headerValue] ? (
          <a href={row[headerValue]} target="_blank" rel="noopener noreferrer">
            <img src={linkedinActive} alt="LinkedIn Logo" />
          </a>
        ) : (
          <img src={linkedinInactive} alt="LinkedIn Logo" />
        );

      case 'sectors':
        return row.sectors && row.sectors.map((sector) => <p>{sector}</p>);
      case 'more':
        return <ExpandMore />;

      default:
        return <div />;
    }
  };

  return (
    <div className="Investors">
      <ServerTable tableVariables={investorVariables} getCellContent={getCellContent} />
    </div>
  );
}
