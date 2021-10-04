import React, { useEffect } from 'react';
// import _ from 'lodash';
// import { Link, useParams } from 'react-router-dom';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
//   TableHead,
//   Paper,
//   Button,
//   Grid,
// } from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import Typography from '@material-ui/core/Typography';
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
    query AllUsers($pagination: PaginationInput!) {
      allUsers(pagination: $pagination) {
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
          }
          linkedinUrl
          city
          state
          mail_country
        }
      }
    }`,
  headers: [
    { value: 'name', label: 'NAME', type: 'name', isFilter: true, keyNotInData: true },
    { value: 'location', label: 'LOCATION', isFilter: true, keyNotInData: true },
    {
      value: 'investmentsCount',
      label: 'INVESTMENTS',
      type: 'investmentsCount',
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
    },
    {
      value: 'more',
      label: 'MORE',
      type: 'more',
      keyNotInData: true,
    },
  ],
  resolverName: 'allUsers',
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
    console.log('Row', row);
    switch (type) {
      // eventually add profile photos?
      case 'name':
        return row.first_name ? `${row['first_name']} ${row['last_name']}` : '';

      case 'location':
        return row.city ? `${row.city}, ${row.state} ${row['mail_country']}` : '';

      case 'investmentsCount':
        return <div>{row[headerValue]}</div>;

      case 'linkedin':
        return row[headerValue] ? (
          <a href={row[headerValue]} target="_blank" rel="noopener noreferrer">
            <img src={linkedinActive} alt="LinkedIn Logo" />
            {row[headerValue]}
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

  // TODO: Use ServerTable, create query for data to include location, sectors, and :inkedIn
  // console.log(temp);

  return (
    <div className="Investors">
      <ServerTable tableVariables={investorVariables} getCellContent={getCellContent} />

      {/* <Grid container>
        <Grid item xs={12}>
          <Paper className="table-wrapper">
            <Grid container justify="space-between" style={{ padding: '16px' }}>
              <Typography variant="h6" gutterBottom>
                Investors
              </Typography>
              {organization === 'allocations' && (
                <Link to="/investors/new">
                  <Button variant="contained" color="secondary">
                    INVITE INVESTOR
                  </Button>
                </Link>
              )}
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Investments</TableCell>
                  <TableCell>Total Invested</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(
                  investors,
                  ({ investments }) => _.sumBy(investments, 'amount'),
                  'desc',
                ).map((investor) => (
                  <TableRow key={investor._id}>
                    <TableCell>{investor.name || investor.email}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>
                      {
                        investor.investments.filter(
                          (inv) => inv.organization === data?.organization?._id,
                        ).length
                      }
                    </TableCell>
                    <TableCell>
                      $
                      {nWithCommas(
                        _.sumBy(
                          investor.investments.filter(
                            (inv) => inv.organization === data?.organization?._id,
                          ),
                          'amount',
                        ),
                      )}
                    </TableCell>
                    <TableCell>
                      {(organization === 'allocations' ||
                        organization === 'vitalize' ||
                        organization === 'irishangels') && (
                        <Link to={`/investor/${investor._id}/home`} target="_blank">
                          View dashboard as {investor.first_name || investor.entity_name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid> */}
    </div>
  );
}
