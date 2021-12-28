import React, { createContext, useContext, useReducer } from 'react';

const DealPageContext = createContext(null);
const DealPageDispatchContext = createContext(null);

const dealPageReducer = (dealPageData, action) => {
  switch (action.type) {
    case 'avatar': {
      return {
        ...dealPageData,
        avatar: action.image,
      };
    }
    case 'edit': {
      return {
        ...dealPageData,
        isEdit: action.value,
      };
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};

const initialDealPageData = { avatar: '', isEdit: false };

export const DealPageProvider = ({ children }) => {
  const [dealPageData, dispatch] = useReducer(dealPageReducer, initialDealPageData);

  return (
    <DealPageContext.Provider value={dealPageData}>
      <DealPageDispatchContext.Provider value={dispatch}>
        {children}
      </DealPageDispatchContext.Provider>
    </DealPageContext.Provider>
  );
};

export const useDealPage = () => {
  return useContext(DealPageContext);
};

export const useDealPageDispatch = () => {
  return useContext(DealPageDispatchContext);
};
