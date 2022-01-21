import React from 'react';

export const Auth0Context = React.createContext();
export const useAuth0 = () => {
  return {
    isAuthenticated: true,
    user: {},
    loading: false,
    auth0Client: null,
    getTokenSilently: () => {},
    loginWithRedirect: async () => {},
    logout: () => {},
  };
};

export const Auth0Provider = ({ children, user, isAuthenticated = true }) => {
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading: false,
        auth0Client: null,
        getTokenSilently: () => {},
        loginWithRedirect: async () => {},
        logout: () => {},
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
