import '@datadog/browser-rum/bundle/datadog-rum';

const moduleFederationURLSuffix = `_next/static/chunks/remoteEntry.js?${Date.now()}`;

window.buildModuleFederationURL = `${process.env.REACT_APP_BUILD_FRONTEND_URL}/${moduleFederationURLSuffix}`;
window.treasuryModuleFederationURL = `${process.env.REACT_APP_TREASURY_FRONTEND_URL}/${moduleFederationURLSuffix}`;
window.cryptoModuleFederationURL = `${process.env.REACT_APP_CRYPTO_FRONTEND_URL}/${moduleFederationURLSuffix}`;
window.investModuleFederationURL = `${process.env.REACT_APP_INVEST_FRONTEND_URL}/${moduleFederationURLSuffix}`;
window.passportModuleFederationURL = `${process.env.REACT_APP_PASSPORT_FRONTEND_URL}/${moduleFederationURLSuffix}`;
window.taxdashboardModuleFerederationURL = `${process.env.REACT_APP_TAX_DASHBOARD_FRONTEND_URL}/${moduleFederationURLSuffix}`;
window.taxModuleFerederationURL = `${process.env.REACT_APP_TAX_FRONTEND_URL}/${moduleFederationURLSuffix}`;

window.DD_RUM.init({
  applicationId: '158b19e3-1c1c-4f3b-9269-b2f23a20814f',
  clientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN,
  env: window.location.hostname.includes('dashboard.allocations.com')
    ? 'production'
    : 'development',
  service: 'allocations-dashboard',
  sampleRate: 100,
  replaySampleRate: 0,
  trackInteractions: true,
  defaultPrivacyLevel: 'allow',
});

import('./bootstrap');
