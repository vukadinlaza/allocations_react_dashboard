const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'container',
        filename: 'remoteEntry.js',
        remotes: {
          treasury: 'treasury@http://192.168.0.110:8083/remoteEntry.js',
        },
      }),
    ],
  },
};
