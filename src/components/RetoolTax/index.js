import React from 'react';
import Retool from 'react-retool';
import { gql, useQuery } from '@apollo/client';

const RETOOL_EMBED_URL = gql`
  query GetRetoolEmbedUrl($app: String!) {
    retoolEmbedUrl(app: $app)
  }
`;

const RetoolTax = () => {
  const { data } = useQuery(RETOOL_EMBED_URL, { variables: { app: 'taxExternal' } });

  if (!data) return <div />;
  return (
    <div style={{ width: '100%', height: '84vh' }}>
      <Retool url={data.retoolEmbedUrl} />
    </div>
  );
};

export default RetoolTax;
