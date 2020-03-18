import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { Row, Col } from 'reactstrap'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useSimpleReducer } from '../../utils/hooks'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, TextField, InputAdornment, InputLabel } from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserSearch from '../../components/forms/UserSearch'
import DealSearch from '../../components/forms/DealSearch'

import "./style.scss"

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
        buyer { name }
        seller { name }
        price
        amount
        side
        settled_at
        matched_at
        deal { company_name }
      }
    }
  }
`

const SAVE_TRADE = gql`
  mutation SaveTrade($org: String!, $trade: TradeInput!) {
    createTrade(org: $org, trade: $trade) {
      _id
    }
  }
`

export default function AdminExchangeOverview () {
  const { organization } = useParams()
  const { data, error, refetch } = useQuery(EXCHANGE_OVERVIEW, { variables: { slug: organization } })

  return (
    <div className="AdminExchangeOverview">
      <Paper className="AdminExchangeOverview" style={{padding: "20px"}}>
        <Row>
          <Col sm={{size: 12}}>
            <h4>Exchange Overview</h4>
            <hr />
            <div>
              <MatchRequests matchRequests={_.get(data, 'organization.matchRequests')} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="5">
            <InputTrade refetch={refetch} />
          </Col>
          <Col sm="7">
            <Trades trades={_.get(data, 'organization.trades')} />
          </Col>
        </Row>
      </Paper>
    </div>
  )
}

function InputTrade ({ refetch }) {
  const { organization } = useParams()
  const [deal, setDeal] = useState(null)
  const [buyer, setBuyer] = useState(null)
  const [seller, setSeller] = useState(null)
  const [trade, setTrade] = useSimpleReducer({ amount: "", price: "", settled_at: "" })
  const [saveTrade] = useMutation(SAVE_TRADE, {
    onCompleted: refetch,
    variables: { org: organization }
  })

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
          deal_id: deal._id
        }
      }
    })
  }

  return (
    <Paper style={{padding: "20px"}}>
      <h6>Input Completed Trade</h6>
      <TextField label="shares"
        style={{width: "100%", marginBottom: "10px"}}
        variant="outlined"
        value={trade.amount}
        onChange={e => setTrade({ amount: e.target.value })} />
      <TextField label="price"
        style={{width: "100%", marginBottom: "10px"}}
        variant="outlined"
        value={trade.price}
        onChange={e => setTrade({ price: e.target.value })} />
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
        onChange={e => setTrade({ settled_at: e.target.value })}
        type="date"
        style={{width: "70%"}}
        InputLabelProps={{ shrink: true }}
      />
      <Button color="secondary"
        style={{margin: "10px"}}
        variant="contained" 
        onClick={submit}>
        SAVE
      </Button>
    </Paper>
  )
}

function MatchRequests ({ matchRequests }) {
  if (!matchRequests || matchRequests.length === 0) {
    return (
      <div className="MatchRequests">
        <h6>Match Requests</h6>
        <div>No Outstanding Match Requests</div>
      </div>
    )
  }

  return (
    <div className="MatchRequests">
      <h6>Match Requests</h6>
      <Paper style={{padding: "20px", margin: "10px 0px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Shares</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchRequests.map(req => (
              <MatchRequest key={req._id} req={req} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

function MatchRequest ({ req }) {
  const { order, buyer, seller, deal } = req
  return (
    <TableRow key={req._id} className="AdminMatchRequest" style={{padding: "10px", marginBottom: "15px"}}>
      <TableCell>{deal.company_name}</TableCell>
      <TableCell>{nWithCommas(order.amount)}</TableCell>
      <TableCell>${order.price}/share</TableCell>
      <TableCell>{buyer.name}</TableCell>
      <TableCell>{seller.name}</TableCell>
      <TableCell className="text-center">
        <Button variant="contained" color="primary">Execute</Button>
      </TableCell>
    </TableRow>
  )
}

function Trades ({ trades = [] }) {
  return (
    <Paper padding={"20px"}>
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
          {trades.map(trade => (
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
  )
}