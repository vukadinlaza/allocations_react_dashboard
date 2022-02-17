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
          invest: `invest@https://invest-frontend-staging.herokuapp.com/_next/static/chunks/remoteEntry.js`,
          build: 'build@[window.buildModuleFederationURL]',
          treasury: `treasury@${process.env.TREASURY_FRONTEND_URL}/_next/static/chunks/remoteEntry.js`,
          blockchain: `blockchain@${process.env.CRYPTO_FRONTEND_URL}/_next/static/chunks/remoteEntry.js`,
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
        },
      }),
      new ExternalTemplateRemotesPlugin(),
    ],
    configure: (webpackConfig) => {
      // webpackConfig.output.enabledLibraryTypes = ['var'];
      webpackConfig.resolve.fallback = { buffer: false };
      return webpackConfig;
    },
  },
};
