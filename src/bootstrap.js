import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { hotjar } from 'react-hotjar';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as AllocationsThemeProvider } from '@allocations/design-system';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import { ToastContainer } from 'react-toastify';
import { datadogRum } from '@datadog/browser-rum';
import Auth0ProviderWithHistory from './auth/Auth0providerWithHistory';
import App from './App';

import theme from './theme';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import AuthorizedApolloProvider from './apollo-client-comp';

datadogRum.init({
  applicationId: process.env.DD_APP_ID,
  clientToken: process.env.DD_CLIENT_TOKEN,
  site: 'datadoghq.com',
  service: process.env.DD_SERVICE,
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel: 'mask-user-input',
});

datadogRum.startSessionReplayRecording();

Bugsnag.start({
  apiKey: 'b6fcaf96aefe9b327e7db6e6d6178a2c',
  plugins: [new BugsnagPluginReact()],
});

/** *
 *
 * wraps App & PublicApp in the react-router context and
 * auth0 context, so that downstream hooks can read the auth and routing data
 *
 * */

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // initialize hotjar
  hotjar.initialize(1630114, 6);
}
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

ReactDOM.render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <AllocationsThemeProvider>
        <Router>
          <Auth0ProviderWithHistory>
            <AuthorizedApolloProvider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
              />
              <div
                style={{
                  backgroundColor: 'rgb(1, 68, 228)',
                  width: 'calc(100% + 6rem)',
                  padding: '20px 50px',
                  color: 'white',
                  textAlign: 'center',
                  margin: '-2rem -3rem',
                  marginBottom: '50px',
                  height: '92px',
                }}
              >
                Monday, February 21st is a federal holiday in the United States in observance of
                President’s Day. Banks in the United States will be closed. Please{' '}
                <a
                  href="https://www.allocations.com/contact-us"
                  style={{
                    color: 'white',
                    textDecoration: 'underline',
                  }}
                >
                  contact support
                </a>{' '}
                for any assistance.
              </div>
              <App />
            </AuthorizedApolloProvider>
          </Auth0ProviderWithHistory>
        </Router>
      </AllocationsThemeProvider>
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
);
