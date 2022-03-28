import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

const OrganizationContext = createContext();

export const CurrentAccountProvider = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const { loading, userProfile } = useAuth();

  useEffect(() => {
    if (!currentOrganization) {
      if (userProfile?.admin) {
        const matchedOrg = userProfile?.organizations_admin?.find(
          (org) => org.slug === 'Allocations-Testing-1641481063461',
        );
        if (matchedOrg) setCurrentOrganization(matchedOrg);
      } else {
        setCurrentOrganization(userProfile?.organizations_admin?.[0]);
      }
    }
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
