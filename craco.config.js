const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'container',
        filename: 'remoteEntry.js',
        remotes: {
          //   mfe1: 'mfe1@http://localhost:8083/remoteEntry.js',
          // treasury: 'treasury@http://localhost:3001/_next/static/chunks/remoteEntry.js',
          invest: `invest@http://localhost:3000/_next/static/chunks/remoteEntry.js`,
        },
        shared: [
          {
            react: {
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
          {
            'react-dom': {
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
          {
            '@material-ui/styles': {
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
          {
            '@material-ui/core': {
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
        ],
      }),
    ],
    configure: (webpackConfig) => {
      // webpackConfig.output.enabledLibraryTypes = ['var'];
      webpackConfig.resolve.fallback = { buffer: false };
      return webpackConfig;
    },
  },
};
