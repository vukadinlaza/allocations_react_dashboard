import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'
import "./style.scss"

export default function AllocationsX () {
  return (
    <div className="AllocationsX-home">
      <div className="AllocationsX-header">
        <h4>Volumetric</h4>
      </div>     
      <Book />
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
        <Col sm="6" md={{size: 4, offset: 0}}>
          <Paper className="Book-side-wrapper">
            <Table className="Book-bids Book-side">
              <TableHead>
                <TableRow>
                  <TableCell className="text-right">Total</TableCell>
                  <TableCell className="text-right">Shares</TableCell>
                  <TableCell className="text-right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.bids.map((bid, i) => (
                  <TableRow key={i} className="bid">
                    <TableCell className="text-right">${bid.amount * bid.price}</TableCell>
                    <TableCell className="text-right">{bid.amount}</TableCell>
                    <TableCell className="text-right">${bid.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
        <Col sm="6" md="4">
          <Paper className="Book-side-wrapper">
            <Table className="Book-asks Book-side">
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell className="text-right">Shares</TableCell>
                  <TableCell className="text-right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.asks.map((ask, i) => (
                  <TableRow key={i} className="ask">
                    <TableCell>${ask.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{ask.amount}</TableCell>
                    <TableCell className="text-right">${ask.amount * ask.price}</TableCell>
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