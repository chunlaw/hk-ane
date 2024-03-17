import React, { ReactNode, useState } from "react";
import AneHk from "ane-hk";

interface AppContextState {
  aneHk: AneHk;
}

interface AppContextValue extends AppContextState {
}

const AppContext = React.createContext({} as AppContextValue);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state] = useState<AppContextState>(DEFAULT_STATE)

  return (
    <AppContext.Provider
      value={{
        ...state
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;


const DEFAULT_STATE: AppContextState = {
  aneHk: new AneHk
};