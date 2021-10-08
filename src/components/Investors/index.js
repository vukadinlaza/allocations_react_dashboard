import React from 'react';
import { Avatar, makeStyles, Box } from '@material-ui/core';
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
    query AllUsersWithInvestmentsCount($pagination: PaginationInput!) {
      allUsersWithInvestmentsCount(pagination: $pagination) {
        count
        users {
          _id
          first_name
          last_name
          signer_full_name
          entity_name
          email
          investmentsCount
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
      align: 'left',
      alignHeader: true,
      isFilter: true,
      isSortable: true,
      keyNotInData: true,
    },
    {
      value: 'location',
      label: 'LOCATION',
      type: 'location',
      align: 'left',
      alignHeader: true,
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
      align: 'center',
      alignHeader: true,
    },
    {
      value: 'linkedinUrl',
      label: 'LINKEDIN',
      type: 'linkedin',
      align: 'center',
      alignHeader: true,
    },
  ],
  resolverName: 'allUsersWithInvestmentsCount',
  dataVariable: 'users',
  defaultSortField: 'investmentsCount',
};

const useStyles = makeStyles(() => ({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > div ': {
      marginRight: '10px',
    },
  },
}));

export default function Investors() {
  const classes = useStyles();

  const displayName = (data) => {
    let name = null;
    if (data.first_name) {
      if (data.last_name) {
        name = `${data.first_name} ${data.last_name}`;
        return (
          <Box className={classes.imageContainer}>
            <Avatar
              alt={name || data.email}
              src={
                data.profileImageKey
                  ? `https://allocations-user-img.s3.us-east-2.amazonaws.com/${data.profileImageKey}`
                  : data.name
              }
            />{' '}
            {name}
          </Box>
        );
      }
      name = data.first_name;
      return (
        <Box className={classes.imageContainer}>
          <Avatar
            alt={name || data.email}
            src={
              data.profileImageKey
                ? `https://allocations-user-img.s3.us-east-2.amazonaws.com/${data.profileImageKey}`
                : data.name
            }
          />{' '}
          {name}
        </Box>
      );
    }
    if (data.signer_full_name) {
      name = data.signer_full_name;
    }

    return (
      <Box className={classes.imageContainer}>
        <Avatar
          alt={name || data.email}
          src={
            data.profileImageKey
              ? `https://allocations-user-img.s3.us-east-2.amazonaws.com/${data.profileImageKey}`
              : data.name
          }
        />{' '}
        {name || data.email}
      </Box>
    );
  };

  const displayLocation = (data) => {
    let location = null;

    if (data.country) {
      if (data.state && data.city) {
        return (location = `${data.city}, ${data.state}, ${data.country}`);
      }
      if (data.city) {
        return (location = `${data.city}, ${data.country}`);
      }
      return (location = data.country);
    }

    return location;
  };

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return displayName(row);

      case 'location':
        return displayLocation(row);

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

      case 'sectors':
        return row.sectors && row.sectors.map((sector) => <p>{sector}</p>);

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
