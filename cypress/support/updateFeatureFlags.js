/// <reference types="cypress" />

// Cypress command to turn on a feature flag for launch darkly
Cypress.Commands.add('updateFeatureFlags', (featureFlags) => {
  // turn off push (EventSource) updates from LaunchDarkly
  cy.intercept({ hostname: /.*clientstream.launchdarkly.com.*/ }, (req) => {
    req.reply('data: no streaming feature flag data here\n\n', {
      'content-type': 'text/event-stream; charset=utf-8',
    });
  });

  // ignore api calls to events endpoint
  cy.intercept({ hostname: /.*events.launchdarkly.com.*/ }, { body: {} });

  // return feature flag values in format expected by launchdarkly client
  cy.intercept({ hostname: /.*app.launchdarkly.com.*/ }, (req) => {
    const body = {};
    Object.entries(featureFlags).forEach(([featureFlagName, featureFlagValue]) => {
      body[featureFlagName] = { value: featureFlagValue };
    });
    req.reply({ body });
  });
});

// // usage
// // must be in beforeEach (vs before) because intercepts are cleared before each test run
// beforeEach(() => {
//   cy.updateFeatureFlags({ 'flag-name': true });
// });
