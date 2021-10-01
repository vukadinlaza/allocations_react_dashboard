import React, { useEffect } from 'react';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
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
import { useAuth } from '../../auth/useAuth';
// import { nWithCommas } from '../../utils/numbers';
import Loader from '../utils/Loader';
import AllocationsTable from '../utils/AllocationsTable';
import './style.scss';

/** *
 *
 * All investors in table view for superadmins
 *
 * */

const GET_INVESTORS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      investors {
        _id
        first_name
        last_name
        email
        name
        investments {
          _id
          amount
          organization
        }
      }
    }
  }
`;

export default function Investors() {
  const { organization } = useParams();
  const { userProfile } = useAuth();
  const [getInvestors, { data, error }] = useLazyQuery(GET_INVESTORS, {
    variables: { slug: organization },
  });

  useEffect(() => {
    if (userProfile && userProfile.email) getInvestors();
  }, [getInvestors, userProfile]);

  if (error) return <div>{error.message}</div>;

  if (!data?.organization?.investors)
    return (
      <div>
        <Loader />
      </div>
    );

  const {
    organization: { investors },
  } = data;

  const headers = [
    {
      value: 'name',
      label: 'NAME',
      type: 'name',
      align: 'center',
    },
    {
      value: 'location',
      label: 'LOCATION',
      type: 'locations',
    },
    {
      value: 'investments',
      label: 'INVESTMENTS',
      type: 'investments',
      align: 'center',
    },
    {
      value: 'sectors',
      label: 'SECTORS',
    },
    {
      value: 'linkedin',
      label: 'LINKEDIN',
    },
    {
      value: 'more',
      label: 'MORE',
      align: 'center',
      type: 'more',
    },
  ];
  const temp = investors.slice(2617);

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return <div>{row[headerValue]}</div>;

      case 'location':
        return <div>Locations</div>;

      case 'investments':
        return <div>{row[headerValue].length}</div>;

      case 'more':
        return <ExpandMore />;

      default:
        return <div />;
    }
  };

  // TODO: Use ServerTable, create query for data to include location, sectors, and :inkedIn

  return (
    <div className="Investors">
      <AllocationsTable data={temp} headers={headers} getCellContent={getCellContent} />
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
