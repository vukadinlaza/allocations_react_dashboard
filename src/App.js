import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";

// styles
import "./App.css";
import { ApolloProvider } from '@apollo/react-hooks';
// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import Deal from "./views/Deal";
initFontAwesome();

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache
});


const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <ApolloProvider client={client}>
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
             <PrivateRoute path="/main" component={Deal} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
    </ApolloProvider>
  );
};

export default App;
