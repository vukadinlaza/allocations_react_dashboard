import React, { useState, useEffect, useContext, createContext } from 'react';

export const Auth0Context = React.createContext();
export const useAuth0 = () => {
  return {
    isAuthenticated: true,
    user: {},
    loading: false,
    auth0Client: null,
    getTokenSilently: () => {},
    loginWithRedirect: async (...p) => {},
    logout: (...p) => {},
  };

  return useContext(Auth0Context);
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
        loginWithRedirect: async (...p) => {},
        logout: (...p) => {},
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
