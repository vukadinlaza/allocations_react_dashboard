import React, { useState } from "react"
import { Container, Row, Col } from "reactstrap";
import { Route, Switch, useRouteMatch } from "react-router-dom"
import PublicDeal from "./components/Deal/Public"
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Button } from '@material-ui/core';
import createAuth0Client from '@auth0/auth0-spa-js';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/graphql"
const client = new ApolloClient({ 
  link: new HttpLink({ uri: API_URL }),
  cache: new InMemoryCache() 
})

export default function PublicApp () {
  const { path } = useRouteMatch()
  const [auth0Client, setAuth0Client] = useState(null)

  return (
    <ApolloProvider client={client}>
      <Container fluid>
        <Row>
          <Col lg="12" className="public-navbar">
            <img src="https://www.allocations.co/assets/img/brand.svg" alt="#" style={{height:'40px', margin: "20px"}} />
            {/**<Button
              color="primary"
              variant="contained"
              className="login-btn"
              onClick={}>
              Sign Up
            </Button>**/}
          </Col>
          <Col xs={{size: 12, offset: 0}} md={{size: 10, offset: 1}} className="app-body">
            <Switch>
              <Route path={`${path}/deals/:company_name`}>
                <PublicDeal />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </ApolloProvider>
  )
}