import React, { createContext, useContext, useState } from 'react';

const OrganizationContext = createContext();

export const CurrentAccountProvider = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState(null);

  return (
    <OrganizationContext.Provider value={{ currentOrganization, setCurrentOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useCurrentOrganizationState = () => {
  const { currentOrganization, setCurrentOrganization } = useContext(OrganizationContext);
  return [currentOrganization, setCurrentOrganization];
};

export const useCurrentOrganization = () => {
  const { currentOrganization } = useContext(OrganizationContext);
  return currentOrganization;
};

export const useSetCurrentOrganization = () => {
  const { setCurrentOrganization } = useContext(OrganizationContext);
  return setCurrentOrganization;
};
