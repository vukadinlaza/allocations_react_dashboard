import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import DealLandingPage from './LandingPage';
import DealLandingPageRedesign from './LandingPageRedesign';

export default function DealOneClick() {
  const { dealPageRedesign } = useFlags();
  return dealPageRedesign && false ? <DealLandingPageRedesign /> : <DealLandingPage />;
}
