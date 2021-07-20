import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import TestRenderer from 'react-test-renderer';
import { InMemoryCache } from '@apollo/client';

export default function MockAllocationsProvider({ children, mocks }) {
  const cache = new InMemoryCache();
  cache.originalReadQuery = cache.readQuery;
  cache.readQuery = (...args) => {
    try {
      return cache.originalReadQuery(...args);
    } catch (err) {
      return undefined;
    }
  };
  return (
    <MockedProvider mocks={mocks} addTypename={false} cache={cache}>
      {children}
    </MockedProvider>
  );
}

export async function wait(ms = 0) {
  await TestRenderer.act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
