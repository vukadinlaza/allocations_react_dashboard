import React from 'react';
import _ from 'lodash';
import { gql } from 'apollo-boost';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button } from '@material-ui/core';
import { nWithCommas, formatDate } from '../../utils/numbers';
import Loader from '../../components/utils/Loader';
import './style.scss';

const DEALS = gql`
  {
    exchangeDeals {
      _id
      slug
      company_name
      company_description
      date_closed
      volume
      organization {
        _id
        name
      }
    }
  }
`;

export default function AllocationsX() {
  const { data } = useQuery(DEALS);

  if (!data) return <Loader />;

  const sortedDeals = _.take(
    _.orderBy(data.exchangeDeals, ['volume', ({ date_closed }) => new Date(date_closed).getTime()], ['desc', 'desc']),
    10,
  );

  return (
    <div className="AllocationsX-Home">
      <Row>
        <Col md={{ size: 10, offset: 1 }} sm={{ size: 10, offset: 1 }}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Company</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Last Valuation</TableCell>
                  <TableCell>Closed Date</TableCell>
                  <TableCell>Volume</TableCell>
                  <TableCell>Trades</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDeals.map((deal, i) => (
                  <TableRow key={deal._id}>
                    <TableCell className="text-center">
                      <span className="ranking">{i + 1}</span>
                    </TableCell>
                    <TableCell>{deal.company_name}</TableCell>
                    <TableCell>{deal.company_description}</TableCell>
                    <TableCell>{deal.last_valuation}</TableCell>
                    <TableCell>{formatDate(deal.date_closed)}</TableCell>
                    <TableCell>${nWithCommas(deal.volume || 0)}</TableCell>
                    <TableCell>{deal.nTrades}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        className="trade-btn"
                        style={{ backgroundColor: '#53B987', color: '#fff' }}
                      >
                        <Link to={`/exchange/${deal.slug}`}>
                          Trade &nbsp;
                          <FontAwesomeIcon icon="arrow-right" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  );
};
