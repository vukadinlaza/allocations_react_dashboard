import React from 'react';
import { Helmet } from 'react-helmet';

const Helm = ({ deal = {} }) => {
  return (
    <Helmet>
      <meta name="keywords" content={`SPV, Fund, Funds, ${deal.company_name}`} />
      <title>{deal.company_name}</title>
      <meta property="og:title" content={`${deal.company_name}`} />
      <meta property="og:description" content={`${deal.company_description}`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://allocations-public.s3.us-east-2.amazonaws.com/logo-tight.png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="500" />
    </Helmet>
  );
};

export default Helm;
