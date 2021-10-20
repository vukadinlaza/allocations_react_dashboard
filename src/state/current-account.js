import React, { createContext, useContext, useState } from 'react';

const AccountContext = createContext();

export const CurrentAccountProvider = ({ children }) => {
  const [account, setAccount] = useState('');

  return (
    <AccountContext.Provider value={{ account, setAccount }}>{children}</AccountContext.Provider>
  );
};

export const useCurrentAccountState = () => {
  const { account, setAccount } = useContext(AccountContext);
  return [account, setAccount];
};

export const useCurrentAccount = () => {
  const { account } = useContext(AccountContext);
  return account;
};

export const useSetCurrentAccount = () => {
  const { setAccount } = useContext(AccountContext);
  return setAccount;
};
