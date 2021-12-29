import React, { createContext, useContext, useReducer } from 'react';

const DealPageContext = createContext(null);
const DealPageDispatchContext = createContext(null);

const dealPageReducer = (dealPageData, action) => {
  switch (action.type) {
    case 'edit': {
      return {
        ...dealPageData,
        isEdit: action.value,
      };
    }
    case 'avatar': {
      return {
        ...dealPageData,
        avatar: action.image,
      };
    }
    case 'coverPhoto': {
      return {
        ...dealPageData,
        coverPhoto: action.image,
      };
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};

const initialDealPageData = { isEdit: false, avatar: '', coverPhoto: '' };

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
