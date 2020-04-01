import React, { useState } from "react"
import { Container, Row, Col } from "reactstrap";
import { Route, Switch, useRouteMatch, useHistory, useLocation, Redirect, useParams } from "react-router-dom"
import PublicDeal from "./components/Deal/Public"
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Button } from '@material-ui/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import queryString from 'query-string'

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
            <Brand />
            
            <Button
              color="primary"
              variant="contained"
              className="login-btn">
              <a href="/" target="_blank">Sign Up</a>
            </Button>
          </Col>
          <Col xs={{size: 12, offset: 0}} md={{size: 10, offset: 1}} className="app-body">
            <Switch>
              <Route path={`${path}/:organization/deals/:deal_slug`}>
                <PublicDeal />
              </Route>
              <Route path={`${path}/deals/:company_name`}>
                <Legacy />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </ApolloProvider>
  )
}

function Legacy () {
  const { company_name } = useParams()
  const location = useLocation()
  const { invite_code } = queryString.parse(location.search)
  if (company_name === "Xplore") {
    return <Redirect to={`/public/helios-capital/deals/${company_name}?invite_code=${invite_code}`} />
  }
  return <Redirect to="/" />
}

function Brand () {
  const match = useRouteMatch('/public/:organization/deals/:deal')
  const history = useHistory()
  const location = useLocation()

  if (match && match.params.organization !== "allocations") {
    return <img height="60px" width="180px" src={`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${match.params.organization}.png`} alt="#" style={{margin: "20px", cursor: "pointer"}} />
  }

  return <img src="https://allocations-public.s3.us-east-2.amazonaws.com/logo.png" onClick={() => history.push('/')} alt="allocations" style={{height: "70px", width: "210px", margin: "20px", cursor: "pointer"}} />
}