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
          invest: `invest@[window.investModuleFerederationURL]`,
          build: 'build@[window.buildModuleFederationURL]',
          treasury: `treasury@[window.treasuryModuleFederationURL]`,
          blockchain: `blockchain@[window.cryptoModuleFederationURL]`,
          taxdashboard: `taxdashboard@[window.taxdashboardModuleFerederationURL]`,
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
