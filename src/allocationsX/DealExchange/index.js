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

  console.log({data})
  const { exchangeDeal } = data

  return (
    <div className="AllocationsX-home">
      <div className="AllocationsX-header">
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

function OrderForm () {
  const [order, setOrder] = useSimpleReducer({price: "", amount: "", direction: "buy"})

  return (
    <div className="OrderForm">
      <FormControl style={{width: "25%", marginRight: "5%"}}>
        <InputLabel>Side</InputLabel>
        <Select value={order.direction}
          onChange={e => setOrder({ direction: e.target.value })}
          inputProps={{name: 'Type'}}>
          <MenuItem value="sell">SELL</MenuItem>
          <MenuItem value="buy">BUY</MenuItem>
        </Select>
      </FormControl>
      <TextField value={order.price}
        style={{width: "70%", marginBottom: "10px"}}
        onChange={e => setOrder({ price: e.target.value })}
        label="Shares"
      />
      <TextField value={order.price}
        style={{width: "100%", marginBottom: "10px"}}
        onChange={e => setOrder({ price: e.target.value })}
        label="Price"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
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
                  <TableCell className="text-right">Price</TableCell>
                  <TableCell className="text-right">Amount</TableCell>
                  <TableCell className="text-right">Value</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.bids.map((bid, i) => (
                  <TableRow key={i} className="bid">
                    <TableCell className="text-right">${bid.price.toFixed(2)}</TableCell>
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
                    <TableCell>${ask.price.toFixed(2)}</TableCell>
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