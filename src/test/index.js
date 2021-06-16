// Testing config and helpers

import React from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Utils from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';
import Deal, { GET_INVESTOR_DEAL, CREATE_INVESTMENT } from '.';
import '../utils/initFontAwesome';

export const Auth0Provider = ({ children, user, isAuthenticated = true }) => {
  const Auth0Context = React.createContext();
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading: false,
        auth0Client: null,
        getTokenSilently: () => {},
        loginWithRedirect: async (...p) => {},
        logout: (...p) => {},
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export function MockAllocationsProvider({ children, mocks, path }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <Auth0Provider>
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      </Auth0Provider>
    </MemoryRouter>
  );
}

export async function wait(ms = 0) {
  await Utils.act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
