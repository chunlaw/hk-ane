import React, { ReactNode, useCallback, useEffect, useState } from "react";
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
  topWait: Partial<Record<Hospital, WaitMsg>>;
  calculatedWaitTime: Record<string, string>;
  calculatedYesterdayWaitTime: Record<string, WaitMsg | undefined>;
  calculatedLastWeekWaitTime: Record<string, WaitMsg | undefined>;
  lastUpdateTime: Date | null;
}

interface AppContextValue extends AppContextState {
  getCalculatedWaitTime: (
    date: Date,
    hospital: Hospital,
  ) => Promise<Array<[string, WaitMsg | undefined]>>;
  updateMapProp: (
    center: {
      lat: number;
      lng: number;
    },
    zoom: number,
  ) => void;
  flyTo: (hospital: Hospital, zoom?: number) => void;
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

  const updateMapProp = useCallback(
    (center: { lat: number; lng: number }, zoom: number) => {
      setState((prev) => ({
        ...prev,
        map: {
          ...prev.map,
          center,
          zoom,
        },
      }));
    },
    [],
  );

  const flyTo = useCallback((hospital: Hospital, zoom?: number) => {
    // @ts-ignore
    setState((prev) => ({
      ...prev,
      map: {
        center: {
          lat: HOSPITAL_GEOCOOR[hospital].lat,
          lng: HOSPITAL_GEOCOOR[hospital].long,
        },
        zoom: zoom ?? prev.map.zoom,
      },
    }));
  }, []);

  useEffect(() => {
    const crawl = () => {
      Promise.all([
        fetch(
          "https://raw.githubusercontent.com/chunlaw/ane-hk/cache/cache.json",
        ).then((r) => r.json()),
        fetch(
          "https://raw.githubusercontent.com/chunlaw/ane-hk/cache/topWait.json",
        ).then((r) => r.json() as Promise<{ waitTime: any }>),
      ]).then(([cache, { waitTime }]) => {
        setState((prev) => ({
          ...prev,
          ...cache,
          // @ts-ignore
          topWait: waitTime.reduce((acc, { hospName, topWait }) => {
            acc[hospName as Hospital] = WAITMSG_MAP[topWait] ?? topWait;
            return acc;
          }, {}),
        }));
      });
    };

    const interval = setInterval(crawl, 30000);
    crawl();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateMapProp,
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
  topWait: {},
  calculatedWaitTime: {},
  calculatedYesterdayWaitTime: {},
  calculatedLastWeekWaitTime: {},
  lastUpdateTime: null,
};

const WAITMSG_MAP: Record<string, WaitMsg> = {
  "Around 1 hour": "< 1",
  "Over 1 hour": "> 1",
  "Over 2 hours": "> 2",
  "Over 3 hours": "> 3",
  "Over 4 hours": "> 4",
  "Over 5 hours": "> 5",
  "Over 6 hours": "> 6",
  "Over 7 hours": "> 7",
  "Over 8 hours": "> 8",
  "Over 9 hours": "> 9",
  "Over 10 hours": "> 10",
  "Over 11 hours": "> 11",
  "Over 12 hours": "> 12",
  "Over 13 hours": "> 13",
  "Over 14 hours": "> 14",
};
