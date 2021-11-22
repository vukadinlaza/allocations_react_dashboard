import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

const OrganizationContext = createContext();

export const CurrentAccountProvider = ({ children }) => {
  const { loading, userProfile } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState(null);

  useEffect(() => {
    if (!currentOrganization) setCurrentOrganization(userProfile?.organizations_admin?.[0]);
  }, [loading]);

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
