import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import DealLandingPage from './LandingPage';
import RemoteDealPage from '../RemoteDealPage';

export default function DealOneClick() {
  const { dealPageRedesign } = useFlags();
  return dealPageRedesign ? <RemoteDealPage /> : <DealLandingPage />;
}
