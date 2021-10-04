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
    { value: 'name', label: 'NAME', type: 'name', isFilter: true, keyNotInData: true },
    { value: 'location', label: 'LOCATION', type: 'location', isFilter: true, keyNotInData: true },
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

  const getCellContent = (type, row, headerValue) => {
    console.log('Row', row.investments?.[0]?.submissionData?.fullName);
    // row.investments[0].submissionData.fullName
    // row?.investments?.[0]?.submissionData?.fullName
    switch (type) {
      // eventually add profile photos?
      case 'name':
        // return row.investments.submissionData
        //   ? `${row?.investments?.[0]?.submissionData?.fullName}`
        //   : '';
        return row.first_name
          ? `${row['first_name']} ${row['last_name']}`
          : row.investments?.[0]?.submissionData
          ? `${row?.investments?.[0]?.submissionData?.fullName}`
          : '';

      case 'location':
        return row.city
          ? `${row.city}, ${row.state}, ${row.country}`
          : row.investments?.[0]?.submissionData
          ? `${row.investments?.[0]?.submissionData?.city}, ${row.investments?.[0]?.submissionData?.state}, ${row.investments?.[0]?.submissionData?.country}`
          : '';

      case 'investmentsCount':
        return <div>{row[headerValue]}</div>;

      case 'linkedin':
        return row[headerValue] ? (
          <a href={row[headerValue]} target="_blank" rel="noopener noreferrer">
            <img src={linkedinActive} alt="LinkedIn Logo" />
          </a>
        ) : (
          <img src={linkedinInactive} alt="LinkedIn Logo" />
        );

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
