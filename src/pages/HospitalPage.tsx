import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../AppContext";
import { Hospital } from "ane-hk";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { WaitMsg } from "ane-hk/dist/types";
import { format } from "date-fns";

interface HospitalPageState {
  isLoading: boolean;
  calculatedWaitTimes: Array<[string, WaitMsg | undefined]>;
  calculatedYesterdayWaitTimes: Array<[string, WaitMsg | undefined]>;
  calculatedLastWeekWaitTimes: Array<[string, WaitMsg | undefined]>;
}

const HospitalPage = () => {
  const { hospital } = useParams();
  const { getCalculatedWaitTime } = useContext(AppContext);
  const [state, setState] = useState<HospitalPageState>(DEFAULT_STATE);
  const { t } = useTranslation();

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    const lastWeek = new Date();
    yesterday.setDate(today.getDate() - 1);
    lastWeek.setDate(today.getDate() - 7);
    Promise.all([
      getCalculatedWaitTime(today, hospital as Hospital),
      getCalculatedWaitTime(yesterday, hospital as Hospital),
      getCalculatedWaitTime(lastWeek, hospital as Hospital),
    ]).then(([tr, yr, lwr]) => {
      setState((prev) => ({
        ...prev,
        calculatedWaitTimes: tr.filter((_, idx) => idx % 4 === 0),
        calculatedYesterdayWaitTimes: yr.filter((_, idx) => idx % 4 === 0),
        calculatedLastWeekWaitTimes: lwr.filter((_, idx) => idx % 4 === 0),
      }));
    });
  }, [getCalculatedWaitTime, hospital]);

  return (
    <Box flex={1} overflow="scroll">
      <Typography variant="h6">{t(hospital ?? "")}</Typography>
      <Typography variant="body1">
        {t("Top wait hours for past 12 hours")}
      </Typography>
      <Table>
        <TableHead sx={{ fontWeight: 700 }}>
          <TableRow>
            <TableCell rowSpan={2}>{t("Time")}</TableCell>
            <TableCell colSpan={3} sx={{ textAlign: "center" }}>
              {t("Real waiting time")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("Today")}</TableCell>
            <TableCell>{t("Yesterday")}</TableCell>
            <TableCell>{t("Last week")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.calculatedWaitTimes.map(([time, waitTime], idx) => (
            <TableRow key={`row-${idx}`}>
              <TableCell>{format(new Date(time), "hh:mm a")}</TableCell>
              <TableCell>
                {waitTime ? t(waitTime) : t("Still waiting")}
              </TableCell>
              {/* @ts-ignore */}
              <TableCell>
                {state.calculatedYesterdayWaitTimes[idx] &&
                state.calculatedYesterdayWaitTimes[idx][1]
                  ? t(state.calculatedYesterdayWaitTimes[idx][1])
                  : t("Still waiting")}
              </TableCell>
              {/* @ts-ignore */}
              <TableCell>
                {state.calculatedLastWeekWaitTimes[idx] &&
                state.calculatedLastWeekWaitTimes[idx][1]
                  ? t(state.calculatedLastWeekWaitTimes[idx][1])
                  : t("Still waiting")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default HospitalPage;

const DEFAULT_STATE: HospitalPageState = {
  isLoading: true,
  calculatedWaitTimes: [],
  calculatedYesterdayWaitTimes: [],
  calculatedLastWeekWaitTimes: [],
};
