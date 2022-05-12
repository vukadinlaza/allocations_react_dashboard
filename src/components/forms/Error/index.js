import React from 'react';
import { colors } from '@allocations/design-system';

export default function FormError({ error }) {
  if (!error) return null;

  const msg =
    error.message.slice(0, 15) === 'GraphQL error: ' ? error.message.slice(15) : error.message;
  return (
    <div
      style={{
        backgroundColor: colors.error[400],
        color: colors.white[100],
        borderRadius: '4px',
        padding: '10px 20px',
        margin: '10px 0px',
      }}
    >
      {msg}
    </div>
  );
}
