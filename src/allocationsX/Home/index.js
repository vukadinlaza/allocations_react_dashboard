import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { useSimpleReducer } from '../../utils/hooks'
import { nWithCommas } from '../../utils/numbers'
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import "./style.scss"

export default function AllocationsX () {
  return (
    <div className="AllocationsX-home">
      <div className="AllocationsX-header">
        <h4>Volumetric</h4>
        <p>3d Printed Organs</p>
      </div>
      {/**<Row>
        <Col sm="5" md={{size: 4, offset: 1}}>
          <OrderForm />
        </Col>
        <Col sm="7" md="6">
          <Stats />
        </Col>
      </Row>**/}  
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
      <FormControl variant="filled" style={{width: "25%", marginRight: "5%"}}>
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
        variant="filled"
      />
      <TextField value={order.price}
        style={{width: "100%", marginBottom: "10px"}}
        onChange={e => setOrder({ price: e.target.value })}
        label="Price"
        variant="filled"
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
            <Table className="Book-bids Book-side">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell className="text-right">Total</TableCell>
                  <TableCell className="text-right">Shares</TableCell>
                  <TableCell className="text-right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.bids.map((bid, i) => (
                  <TableRow key={i} className="bid">
                    <TableCell className="text-center">
                      <Button variant="contained" color="secondary" className="sell-button">
                        SELL
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${nWithCommas(bid.amount * bid.price)}</TableCell>
                    <TableCell className="text-right">{nWithCommas(bid.amount)}</TableCell>
                    <TableCell className="text-right">${bid.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
        <Col sm="6" md="5">
          <Paper className="Book-side-wrapper">
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