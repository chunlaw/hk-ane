import {
  Box,
  Table,
  Typography,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { AVAILABLE_HOSPITALS, Hospital } from "ane-hk";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";
import { WaitMsg } from "ane-hk/dist/types";
import { format } from "date-fns";

interface WaitListPageState {
  calculatedWaitTime: Record<string, string>;
  calculatedYesterdayWaitTime: Record<string, WaitMsg | undefined>;
  calculatedLastWeekWaitTime: Record<string, WaitMsg | undefined>;
  isLoadingWaitTime: boolean;
  isLoadingYesterdayWaitTime: boolean;
  isLoadingLastWeekWaitTime: boolean;
  lastUpdateTime: Date | null;
}

const WaitListPage = () => {
  const [state, setState] = useState<WaitListPageState>(DEFAULT_STATE);
  const { getCalculatedWaitTime } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const crawl = useCallback(async () => {
    const today = new Date();
    const yesterday = new Date();
    const lastWeek = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    lastWeek.setDate(lastWeek.getDate() - 7);
    await Promise.all(
      AVAILABLE_HOSPITALS.en.map((hosp) =>
        getCalculatedWaitTime(today, hosp as Hospital).then((tr) => ({
          hosp,
          res: format(
            new Date(tr.filter(([_, v]) => v !== undefined)[0][0]),
            "hh:mm a",
          ),
        })),
      ),
    ).then((res) => {
      setState((prev) => ({
        ...prev,
        calculatedWaitTime: res.reduce(
          (acc, { hosp, res }) => {
            acc[hosp] = res;
            return acc;
          },
          {} as WaitListPageState["calculatedWaitTime"],
        ),
        lastUpdateTime: new Date(res[0].res[0][0][0]),
        isLoadingWaitTime: false,
      }));
    });

    await Promise.all(
      AVAILABLE_HOSPITALS.en.map((hosp) =>
        getCalculatedWaitTime(yesterday, hosp as Hospital).then((yr) => ({
          hosp,
          res: yr[0][1],
        })),
      ),
    ).then((res) => {
      setState((prev) => ({
        ...prev,
        calculatedYesterdayWaitTime: res.reduce(
          (acc, { hosp, res }) => {
            acc[hosp] = res;
            return acc;
          },
          {} as WaitListPageState["calculatedYesterdayWaitTime"],
        ),
        isLoadingYesterdayWaitTime: false,
      }));
    });

    await Promise.all(
      AVAILABLE_HOSPITALS.en.map((hosp) =>
        getCalculatedWaitTime(lastWeek, hosp as Hospital).then((yr) => ({
          hosp,
          res: yr[0][1],
        })),
      ),
    ).then((res) => {
      setState((prev) => ({
        ...prev,
        calculatedLastWeekWaitTime: res.reduce(
          (acc, { hosp, res }) => {
            acc[hosp] = res;
            return acc;
          },
          {} as WaitListPageState["calculatedLastWeekWaitTime"],
        ),
        isLoadingLastWeekWaitTime: false,
      }));
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(crawl, 300000);
    crawl();
    return () => {
      clearInterval(timer);
    };
  }, [crawl]);

  const handleClick = useCallback(
    (hospital: Hospital) => () => {
      navigate(`/${i18n.language}/${hospital}`);
    },
    [i18n.language, navigate],
  );

  return (
    <Box
      flex={1}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      {state.lastUpdateTime && (
        <Typography variant="caption">
          {t("Last updated time: ")} {format(state.lastUpdateTime, "hh:mm a")}
        </Typography>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell rowSpan={2}>{t("Hospital")}</TableCell>
            <TableCell rowSpan={2}>
              {t("Arrival time of the current head")}
            </TableCell>
            <TableCell colSpan={2} sx={{ textAlign: "center" }}>
              {t("Real waiting time")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("Current time yesterday")}</TableCell>
            <TableCell>{t("Current time last week")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {AVAILABLE_HOSPITALS.en.map((hospName) => (
            <TableRow key={hospName}>
              <TableCell>
                <Box
                  onClick={handleClick(hospName as Hospital)}
                  sx={{ cursor: "pointer" }}
                >
                  {t(hospName)}
                </Box>
              </TableCell>
              <TableCell>
                {state.isLoadingWaitTime ? (
                  <CircularProgress size="12px" />
                ) : (
                  state.calculatedWaitTime[hospName]
                )}
              </TableCell>
              <TableCell>
                {state.isLoadingYesterdayWaitTime ? (
                  <CircularProgress size="12px" />
                ) : (
                  t(state.calculatedYesterdayWaitTime[hospName] ?? "No data")
                )}
              </TableCell>
              <TableCell>
                {state.isLoadingLastWeekWaitTime ? (
                  <CircularProgress size="12px" />
                ) : (
                  t(state.calculatedLastWeekWaitTime[hospName] ?? "No data")
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default WaitListPage;

const DEFAULT_STATE: WaitListPageState = {
  calculatedWaitTime: {},
  calculatedYesterdayWaitTime: {},
  calculatedLastWeekWaitTime: {},
  isLoadingWaitTime: true,
  isLoadingYesterdayWaitTime: true,
  isLoadingLastWeekWaitTime: true,
  lastUpdateTime: null,
};
