import React, { ReactNode, useCallback, useState } from "react";
import AneHk, { Hospital } from "ane-hk";
import { WaitMsg } from "ane-hk/dist/types";

interface AppContextState {
  aneHk: AneHk;
}

interface AppContextValue extends AppContextState {
  getCalculatedWaitTime: (
    date: Date,
    hospital: Hospital,
  ) => Promise<Array<[string, WaitMsg | undefined]>>;
}

const AppContext = React.createContext({} as AppContextValue);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state] = useState<AppContextState>(DEFAULT_STATE);

  const getCalculatedWaitTime = useCallback(
    (date: Date, hospital: Hospital) => {
      return state.aneHk
        .getLast24HoursForParticularDate(date, hospital as Hospital)
        .then((r) =>
          Promise.all(
            r.map(([time]) =>
              state.aneHk
                .calculateWaitTime(new Date(time), hospital as Hospital)
                .then((v) => [time, v] as [string, WaitMsg | undefined]),
            ),
          ),
        );
    },
    [state.aneHk],
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        getCalculatedWaitTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

const DEFAULT_STATE: AppContextState = {
  aneHk: new AneHk(),
};
