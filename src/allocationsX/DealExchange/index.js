import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { useSimpleReducer } from '../../utils/hooks'
import { nWithCommas } from '../../utils/numbers'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import "./style.scss"

const DEAL = gql`
  query ExchangeDeal($slug: String!) {
    exchangeDeal(slug: $slug) {
      _id
      company_name
      company_description
      slug
      organization {
        _id
        slug
      }
    }
  }
`

export default function ExchangeDeal () {
  const { deal } = useParams()
  const { data, error, loading } = useQuery(DEAL, { variables: { slug: deal } })

  if (!data) return <Loader />
  const { exchangeDeal } = data

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
                <div>10,000</div>
              </span>
              <span className="header-card">
                <div>Nominal Value of Your Holding</div>
                <div>$10,000</div>
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
          <OrderForm />
        </Col>
        {/**<Col sm="7" md="6">
          <Stats />
        </Col>**/}
      </Row>  
      <Book />
    </div>
  )
}

function Stats () {
  return (
    <div className="exchange-stats">
    </div>
  )
}

const book = {
  bids: [
    { price: 4.05, amount: 2500 },
    { price: 4.00, amount: 1000 },
    { price: 3.95, amount: 5000 },
    { price: 3.80, amount: 25000 },
    { price: 3.50, amount: 10000 },
    { price: 3.00, amount: 3000 }
  ],
  asks: [
    { price: 4.15, amount: 5000 },
    { price: 4.25, amount: 1500 },
    { price: 4.30, amount: 40000 },
    { price: 4.75, amount: 10000 }
  ]
}

const investment = {
  shares: 12000
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

function OrderForm () {
  const [order, setOrder] = useSimpleReducer({price: "", amount: "", direction: "sell", cost: 0})

  useEffect(() => {
    if (order.amount) {
      setOrder({ cost: getCost({ book, ...order }) })
    } else {
      setOrder({ cost: 0 })
    }
  }, [order.amount, order.direction])

  return (
    <Paper className="OrderForm">
      <FormControl style={{width: "25%", marginRight: "5%"}}>
        <InputLabel>Side</InputLabel>
        <Select value={order.direction}
          onChange={e => setOrder({ direction: e.target.value })}
          inputProps={{name: 'Type'}}>
          <MenuItem value="sell">SELL</MenuItem>
          <MenuItem value="buy">BUY</MenuItem>
        </Select>
      </FormControl>
      <TextField value={order.amount}
        style={{width: "70%", marginBottom: "10px"}}
        onChange={e => setOrder({ amount: e.target.value })}
        label="Shares"
        InputProps={{
          endAdornment: <InputAdornment style={{cursor: "pointer"}} position="end" onClick={() => setOrder({amount: investment.shares})}>max</InputAdornment>,
        }}
      />
      <div className="order-details">
        <span>Cost: ${nWithCommas(order.cost.toFixed(0))}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="contained" size="small" color="primary">SUBMIT</Button>
      </div>
    </Paper>
  )
}

function Book () {
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
                {book.bids.map((bid, i) => (
                  <TableRow key={i} className="bid">
                    <TableCell className="price">${bid.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{nWithCommas(bid.amount)}</TableCell>
                    <TableCell className="text-right">${nWithCommas(bid.amount * bid.price)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="contained" color="secondary" className="sell-button">
                        SELL
                      </Button>
                    </TableCell>
                  </TableRow>
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
                {book.asks.map((ask, i) => (
                  <TableRow key={i} className="ask">
                    <TableCell className="price">${ask.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{nWithCommas(ask.amount)}</TableCell>
                    <TableCell className="text-right">${nWithCommas(ask.amount * ask.price)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="contained" className="buy-button">
                        BUY
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
  )
}