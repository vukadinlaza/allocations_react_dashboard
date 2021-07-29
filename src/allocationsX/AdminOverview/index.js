import React, { useState } from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Button,
  Typography,
  TextField,
  Modal,
} from '@material-ui/core';
import Loader from '../../components/utils/Loader';
import { nWithCommas, formatDate } from '../../utils/numbers';
import { useSimpleReducer, useToggle } from '../../utils/hooks';
import UserSearch from '../../components/forms/UserSearch';
import DealSearch from '../../components/forms/DealSearch';

import './style.scss';

const EXCHANGE_OVERVIEW = gql`
  query ExchangeOverview($slug: String!) {
    organization(slug: $slug) {
      matchRequests {
        _id
        status
        submitted_at
        deal {
          company_name
        }
        order {
          _id
          price
          amount
          side
        }
        seller {
          name
        }
        buyer {
          name
        }
      }
      trades {
        _id
        buyer {
          name
        }
        seller {
          name
        }
        price
        amount
        side
        settled_at
        matched_at
        deal {
          company_name
        }
      }
    }
  }
`;

const SAVE_TRADE = gql`
  mutation SaveTrade($org: String!, $trade: TradeInput!) {
    createTrade(org: $org, trade: $trade) {
      _id
    }
  }
`;

export default function AdminExchangeOverview() {
  const [showInputTrade, toggleShow] = useToggle(false);
  const { organization: slug } = useParams();
  const { data } = useQuery(EXCHANGE_OVERVIEW, { variables: { slug } });

  if (!data) return <Loader />;
  const { organization } = data;
  const trades = _.orderBy(organization.trades, (t) => new Date(t.settled_at).getTime(), 'desc');

  return (
    <div className="AdminExchangeOverview">
      <Modal open={showInputTrade} onClose={toggleShow}>
        <InputTrade toggleShow={toggleShow} />
      </Modal>
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <Paper className="header">
            <h4>
              Exchange Overview&nbsp;
              <Button size="small" variant="contained" color="secondary" onClick={toggleShow}>
                Add Trade
              </Button>
            </h4>
          </Paper>
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <MatchRequests matchRequests={organization.matchRequests} />
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <Trades trades={trades} />
        </Col>
      </Row>
    </div>
  );
}

function InputTrade({ refetch, toggleShow }) {
  const { organization } = useParams();
  const [deal, setDeal] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);
  const [trade, setTrade] = useSimpleReducer({ amount: '', price: '', settled_at: '' });
  const [saveTrade] = useMutation(SAVE_TRADE, {
    onCompleted: refetch,
    variables: { org: organization },
  });

  const submit = () => {
    // save trade
    saveTrade({
      variables: {
        trade: {
          ...trade,
          price: Number(trade.price),
          amount: Number(trade.amount),
          seller_id: seller._id,
          buyer_id: buyer._id,
          deal_id: deal._id,
        },
      },
    });
  };

  return (
    <div
      className="InputTrade-wrapper"
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleShow();
      }}
    >
      <Paper className="InputTrade" style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Input Completed Trade
        </Typography>
        <TextField
          label="shares"
          style={{ width: '100%', marginBottom: '10px' }}
          variant="outlined"
          value={trade.amount}
          onChange={(e) => setTrade({ amount: e.target.value })}
        />
        <TextField
          label="price"
          style={{ width: '100%', marginBottom: '10px' }}
          variant="outlined"
          value={trade.price}
          onChange={(e) => setTrade({ price: e.target.value })}
        />
        <UserSearch user={buyer} setUser={setBuyer} label="Buyer" showLabelOnSelect />
        <hr />
        <UserSearch user={seller} setUser={setSeller} label="Seller" showLabelOnSelect />
        <hr />
        <DealSearch deal={deal} setDeal={setDeal} />
        <hr />
        <TextField
          label="Trade Date"
          variant="outlined"
          value={trade.settled_at}
          onChange={(e) => setTrade({ settled_at: e.target.value })}
          type="date"
          style={{ width: '70%' }}
          InputLabelProps={{ shrink: true }}
        />
        <Button color="secondary" style={{ margin: '10px' }} variant="contained" onClick={submit}>
          SAVE
        </Button>
      </Paper>
    </div>
  );
}

function MatchRequests({ matchRequests = [] }) {
  if (!matchRequests || matchRequests.length === 0) {
    return (
      <div className="MatchRequests">
        <h5>
          Match Requests <span className="circular-number">{matchRequests.length}</span>
        </h5>
        <Paper className="table-wrapper" />
      </div>
    );
  }

  return (
    <div className="MatchRequests">
      <h5>
        Match Requests <span className="circular-number">{matchRequests.length}</span>
      </h5>
      <Paper className="table-wrapper">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Shares</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {matchRequests.map((req) => (
              <MatchRequest key={req._id} req={req} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

function MatchRequest({ req }) {
  const { order, buyer, seller, deal } = req;
  return (
    <TableRow
      key={req._id}
      className="AdminMatchRequest"
      style={{ padding: '10px', marginBottom: '15px' }}
    >
      <TableCell>{deal.company_name}</TableCell>
      <TableCell>{nWithCommas(order.amount)}</TableCell>
      <TableCell>${order.price}/share</TableCell>
      <TableCell>{buyer.name}</TableCell>
      <TableCell>{seller.name}</TableCell>
      <TableCell className="text-center">
        <Button variant="contained" color="primary" style={{ backgroundColor: '#21ce99' }}>
          Execute
        </Button>
      </TableCell>
    </TableRow>
  );
}

function Trades({ trades = [] }) {
  return (
    <>
      <h5>
        Completed Trades <span className="circular-number">{trades.length}</span>
      </h5>
      <Paper className="Trades table-wrapper">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Deal</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shares</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Seller</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade._id}>
                <TableCell>{trade.deal.company_name}</TableCell>
                <TableCell>${trade.price}</TableCell>
                <TableCell>{nWithCommas(trade.amount)}</TableCell>
                <TableCell>{trade.settled_at && formatDate(trade.settled_at)}</TableCell>
                <TableCell>{trade.buyer.name}</TableCell>
                <TableCell>{trade.seller.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
