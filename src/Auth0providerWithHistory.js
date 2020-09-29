import React from 'react'
import { useHistory } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

const Auth0ProviderWithHistory = ({ children }) => {
    const history = useHistory();
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const client_id = process.env.REACT_APP_AUTH0_KEY;
    const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
    const onRedirectCallback = (appState) => {
        history.push(appState?.returnTo || window.location.pathname);
    };
    return (<Auth0Provider
        domain={domain}
        clientId={client_id}
        audience={audience}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        {children}
    </Auth0Provider>)
}

export default Auth0ProviderWithHistory