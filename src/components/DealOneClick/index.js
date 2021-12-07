import React from 'react';
import DealLandingPage from './LandingPage/LandingPage';
import DealLandingPageRedesign from './LandingPageRedesign/LandingPageRedesign';
import { useFlags } from 'launchdarkly-react-client-sdk';

export default function DealOneClick() {
  const { dealPageRedesign } = useFlags();
  return dealPageRedesign ? <DealLandingPageRedesign /> : <DealLandingPage />;
}
