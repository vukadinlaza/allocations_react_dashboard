import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import DealLandingPage from './LandingPage/LandingPage';
import DealLandingPageRedesign from './LandingPageRedesign/LandingPageRedesign';

export default function DealOneClick() {
  const { dealPageRedesign } = useFlags();
  return dealPageRedesign ? <DealLandingPageRedesign /> : <DealLandingPage />;
}
