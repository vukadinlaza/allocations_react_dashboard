// eslint-disable-next-line no-unused-expressions
const moduleFederationURLSuffix = `_next/static/chunks/remoteEntry.js?${Date.now()}`;

window.buildModuleFederationURL = `${process.env.REACT_APP_BUILD_FRONTEND_URL}/${moduleFederationURLSuffix}`;

window.treasuryModuleFederationURL = `${process.env.REACT_APP_TREASURY_FRONTEND_URL}/${moduleFederationURLSuffix}`;

window.cryptoModuleFederationURL = `${process.env.REACT_APP_CRYPTO_FRONTEND_URL}/${moduleFederationURLSuffix}`;

window.investModuleFederationURL = `${process.env.REACT_APP_INVEST_FRONTEND_URL}/${moduleFederationURLSuffix}`;

import('./bootstrap');
