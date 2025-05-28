import React, { createContext, useState } from 'react';

export const AppContext = createContext({ translations: {} });

export default function ContextProvider({ children }) {
  const [translations, setTranslations] = useState({});
  return (
    <AppContext.Provider value={{ translations, setTranslations }}>
      {children}
    </AppContext.Provider>
  );
}