import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { useSimpleReducer } from '../../utils/hooks'
import { nWithCommas } from '../../utils/numbers'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, TextField, InputAdornment, InputLabel } from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.scss"

const DEAL = gql`
  query ExchangeDeal($slug: String!) {
    exchangeDeal(slug: $slug) {
      _id
      company_name
      company_description
      slug
      shares
      organization {
        _id
        slug
      }
      orders {
        _id
        user_id
        side
        price
        amount
        created_at
      }
      matchRequests {
        _id
        status
        submitted_at
        order {
          _id
          price
          amount
          side
        }
      }
    }
    investor {
      _id
    }
  }
`

const CREATE_ORDER = gql`
  mutation CreateOrder($order: OrderInput!) {
    createOrder(order: $order) {
      _id
    }
  }
`

function orders2Book (orders) {
  const { ask, bid } = _.groupBy(orders, 'side')
  return {
    asks: _.orderBy(ask, 'price', 'asc'),
    bids: _.orderBy(bid, 'price', 'desc')
  }
}

export default function ExchangeDeal () {
  const { deal } = useParams()
  const [book, setBook] = useState({asks: [], bids: []})
  const { data, error, refetch } = useQuery(DEAL, { variables: { slug: deal } })

  useEffect(() => {
    if (data) setBook(orders2Book(data.exchangeDeal.orders))
  }, [data])

  if (!data) return <Loader />
  const { exchangeDeal, investor } = data

  return (
    <div className="AllocationsX-home">
      <div className="AllocationsX-header">
        <Row>
          <Col md={{size: 10, offset: 1}}>
            <h4>{exchangeDeal.company_name}</h4>
            <p>{exchangeDeal.company_description}</p>
            <div className="info">
              <span className="header-card">
                <div>Your SPV shares</div>
                <div>{nWithCommas(exchangeDeal.shares)}</div>
              </span>
              <span className="header-card">
                <div>Nominal Value of Your Holding</div>
                <div>${nWithCommas(exchangeDeal.shares)}</div>
              </span>
              {/**<span className="header-card">
                <div>Estimated Current Value of your Holding</div>
                <div>$65,000</div>
              </span>
              <span className="header-card">
                <div>Estimated Share Value</div>
                <div>$6.50</div>
              </span>**/}
              <span className="header-card">
                <div>Initial Share Price</div>
                <div>$1</div>
              </span>
              <span className="header-card">
                <div>Last Trade Price</div>
                <div>-</div>
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <Col sm="5" md={{size: 4, offset: 1}}>
          <OrderForm exchangeDeal={exchangeDeal} investor={investor} refetch={refetch} />
        </Col>
        <Col sm="7" md="6">
          <MatchRequests matchRequests={exchangeDeal.matchRequests} />
        </Col>
      </Row>  
      <Book book={book} investor={investor} refetch={refetch} />
    </div>
  )
}

function MatchRequests ({ matchRequests }) {
  return matchRequests.map(req => (<MatchRequest key={req._id} req={req} />))
}

function MatchRequest ({ req }) {
  const { order } = req
  return (
    <Paper key={req._id} className="MatchRequest" style={{padding: "10px", marginBottom: "10px"}}>
      <span>{order.side === "ask" 
        ? <span className="direction direction-buy">BUY</span> 
        : <span className="direction direction-buy">SELL</span>
      }</span>
      <span style={{fontSize: "1.2em"}}>{nWithCommas(order.amount)} shares</span>
      <span>${order.price}/share</span>
      <span className="pending"><i>PENDING</i> &nbsp;&nbsp;<FontAwesomeIcon icon="spinner" /></span>
    </Paper>
  )
}

function getCost({ book, amount, direction }) {
  if (direction === "buy") {
    let left = amount
    let cost = 0
    for (let i = 0; i < book.asks.length; i++) {
      const ask = book.asks[i]
      if (ask.amount < left) {
        left -= ask.amount
        cost += ask.amount * ask.price
      } else {
        cost += (left * ask.price)
        break 
      }
    }
    return cost
  } else {
    let left = amount
    let cost = 0
    for (let i = 0; i < book.bids.length; i++) {
      const bid = book.bids[i]
      if (bid.amount < left) {
        left -= bid.amount
        cost += bid.amount * bid.price
      } else {
        cost += (left * bid.price)
        break 
      }
    }
    return cost
  }
}

function OrderForm ({ exchangeDeal, investor, refetch }) {
  const [order, setOrder] = useSimpleReducer({price: "", amount: "", direction: "sell", cost: 0})
  const [createOrder, {data, error}] = useMutation(CREATE_ORDER, { 
    onCompleted: () => {
      setOrder({price: "", amount: "", direction: "sell", cost: 0})
      refetch()
    } 
  })

  useEffect(() => {
    if (order.amount && order.price) {
      setOrder({ cost: (order.amount * order.price) })
    } else {
      setOrder({ cost: 0 })
    }
  }, [order.amount, order.direction, order.price])

  const submit = () => {
    // TODO validate
    createOrder({ variables: { 
      order: {
        price: Number(order.price),
        amount: Number(order.amount),
        side: order.direction === "buy" ? "bid" : "ask",
        deal_id: exchangeDeal._id, 
        user_id: investor._id } 
      } 
    })
  }

  return (
    <Paper className="OrderForm">
      <div className="choose-direction">
        <span className={"direction direction-buy"} data-selected={order.direction === "buy"} onClick={() => setOrder({ direction: "buy" })}>Buy</span>
        <span className={"direction direction-sell"} data-selected={order.direction === "sell"} onClick={() => setOrder({ direction: "sell" })}>Sell</span>
      </div>
      <TextField value={order.amount}
        style={{width: "100%", marginBottom: "15px"}}
        onChange={e => setOrder({ amount: e.target.value })}
        label="Shares"
        variant="outlined"
        InputProps={{
          endAdornment: <InputAdornment style={{cursor: "pointer"}} position="end" onClick={() => setOrder({amount: exchangeDeal.shares})}>max</InputAdornment>,
        }}
      />
      <TextField value={order.price}
        style={{width: "100%", marginBottom: "15px"}}
        onChange={e => setOrder({ price: e.target.value })}
        label="Price"
        variant="outlined"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <div className="order-details">
        <span>Total Amount: ${nWithCommas(order.cost.toFixed(0))}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="contained" size="small" color="primary" onClick={submit}>SUBMIT</Button>
      </div>
    </Paper>
  )
}

function Book ({ book, investor, refetch }) {
  return (
    <div className="Book">
      <Row>
        <Col sm="6" md={{size: 5, offset: 1}}>
          <Paper className="Book-side-wrapper">
            <div className="Book-header">Buy Orders</div>
            <Table className="Book-bids Book-side">
              <TableHead>
                <TableRow>
                  <TableCell className="">Price</TableCell>
                  <TableCell className="text-right">Amount</TableCell>
                  <TableCell className="text-right">Value</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.bids.length === 0 && <Empty />}
                {book.bids.map(bid => (
                  <Order key={bid._id} {...bid} investor={investor} refetch={refetch} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
        <Col sm="6" md="5">
          <Paper className="Book-side-wrapper">
            <div className="Book-header">Sell Orders</div>
            <Table className="Book-asks Book-side">
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell className="text-right">Shares</TableCell>
                  <TableCell className="text-right">Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.asks.length === 0 && <Empty />}
                {book.asks.map(ask => (
                  <Order key={ask._id} {...ask} investor={investor} refetch={refetch} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

const CANCEL_ORDER = gql`
  mutation CancelOrder($order_id: String!) {
    cancelOrder(order_id: $order_id) {
      _id
    }
  }
`

const MATCH_REQUEST = gql`
  mutation MatchRequest($order_id: String!) {
    newMatchRequest(order_id: $order_id) {
      _id
    }
  }
`

function Order ({ investor, _id, user_id, refetch, side, price, amount }) {
  const [cancel, { data, error }] = useMutation(CANCEL_ORDER, { 
    variables: { order_id: _id },
    onCompleted: refetch 
  })

  const [matchRequest] = useMutation(MATCH_REQUEST, {
    variables: { order_id: _id },
    onCompleted: refetch
  })

  const submitMatchRequest = () => {
    matchRequest()
  }

  const rowStyle = investor._id === user_id
    ? { backgroundColor: "#ffffe0" }
    : {}

  const actionButton = investor._id === user_id
    ? <Button variant="contained" className="cancel-btn" onClick={cancel}>CANCEL</Button>
    : <Button variant="contained" color="secondary" 
        onClick={submitMatchRequest}
        className={side === "ask" ? "buy-button" : "sell-button"}>
        {side === "ask" ? "BUY" : "SELL"}
      </Button>

  if (side === "ask") {
    return (
      <TableRow key={_id} className="ask" style={rowStyle}>
        <TableCell className="price">${price.toFixed(2)}</TableCell>
        <TableCell className="text-right">{nWithCommas(amount)}</TableCell>
        <TableCell className="text-right">${nWithCommas((amount * price).toFixed(0))}</TableCell>
        <TableCell className="text-center">{actionButton}</TableCell>
      </TableRow>
    )
  } else {
    return (
      <TableRow key={_id} className="bid" style={rowStyle}>
        <TableCell className="price">${price.toFixed(2)}</TableCell>
        <TableCell className="text-right">{nWithCommas(amount)}</TableCell>
        <TableCell className="text-right">${nWithCommas((amount * price).toFixed(0))}</TableCell>
        <TableCell className="text-center">{actionButton}</TableCell>
      </TableRow>
    )
  }
}

function Empty () {
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  )
}