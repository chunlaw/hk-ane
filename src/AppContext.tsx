import React, { ReactNode, useCallback, useState } from "react";
import AneHk, { Hospital } from "ane-hk";
import { WaitMsg } from "ane-hk/dist/types";
import { HOSPITAL_GEOCOOR } from "ane-hk";

interface AppContextState {
  aneHk: AneHk;
  map: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
}

interface AppContextValue extends AppContextState {
  getCalculatedWaitTime: (
    date: Date,
    hospital: Hospital,
  ) => Promise<Array<[string, WaitMsg | undefined]>>;
  flyTo: (hospital: Hospital, zoom: number) => void;
}

const AppContext = React.createContext({} as AppContextValue);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppContextState>(DEFAULT_STATE);

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

  const flyTo = useCallback((hospital: Hospital, zoom: number) => {
    // @ts-ignore
    setState((prev) => ({
      ...prev,
      map: {
        center: {
          lat: HOSPITAL_GEOCOOR[hospital].lat,
          lng: HOSPITAL_GEOCOOR[hospital].long,
        },
        zoom,
      },
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        getCalculatedWaitTime,
        flyTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

const DEFAULT_STATE: AppContextState = {
  aneHk: new AneHk(),
  map: {
    center: {
      lat: 22.349983,
      lng: 114.112759,
    },
    zoom: 11,
  },
};
