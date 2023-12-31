/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');

module.exports = {
  webpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'container',
        filename: 'remoteEntry.js',
        remotes: {
          invest: `invest@[window.investModuleFederationURL]`,
          passport: `passport@[window.passportModuleFederationURL]`,
          build: 'build@[window.buildModuleFederationURL]',
          treasury: `treasury@[window.treasuryModuleFederationURL]`,
          blockchain: `blockchain@[window.cryptoModuleFederationURL]`,
          taxdashboard: `taxdashboard@[window.taxdashboardModuleFerederationURL]`,
          tax: `tax@[window.taxModuleFerederationURL]`,
        },
        shared: {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: false,
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: false,
          },
          '@material-ui/styles': {
            eager: true,
            singleton: true,
            requiredVersion: false,
          },
          '@material-ui/core': {
            eager: true,
            singleton: true,
            requiredVersion: false,
          },
          'launchdarkly-react-client-sdk': {
            singleton: true,
            requiredVersion: false,
          },
          '@allocations/nextjs-common': {
            singleton: true,
            requiredVersion: false,
          },
        },
      }),
      new ExternalTemplateRemotesPlugin(),
    ],
    configure: (webpackConfig) => {
      // webpackConfig.output.enabledLibraryTypes = ['var'];
      webpackConfig.resolve.fallback = { buffer: false, util: false };
      return webpackConfig;
    },
  },
};
