import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { WaitMsg } from "ane-hk/dist/types";
import { format } from "date-fns";
import { HOSPITAL_ADDRESS } from "../constants";
import { setSeoHeader } from "../utils";

interface HospitalPageState {
  calculatedWaitTimes: Array<[string, WaitMsg | undefined]>;
  calculatedYesterdayWaitTimes: Array<[string, WaitMsg | undefined]>;
  calculatedLastWeekWaitTimes: Array<[string, WaitMsg | undefined]>;
}

const HospitalPage = () => {
  const { hospital } = useParams();
  const [state, setState] = useState<HospitalPageState>(DEFAULT_STATE);
  const { t, i18n } = useTranslation();

  const crawl = useCallback(() => {
    fetch(
      `https://raw.githubusercontent.com/chunlaw/ane-hk/cache/${hospital?.replace(/ /g, "-")}.json`,
    )
      .then((r) => r.json())
      .then((res: HospitalPageState) => {
        setState({
          calculatedWaitTimes: res.calculatedWaitTimes.filter(
            (_, idx) => idx % 4 === 0,
          ),
          calculatedYesterdayWaitTimes: res.calculatedYesterdayWaitTimes.filter(
            (_, idx) => idx % 4 === 0,
          ),
          calculatedLastWeekWaitTimes: res.calculatedLastWeekWaitTimes.filter(
            (_, idx) => idx % 4 === 0,
          ),
        });
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      crawl();
    }, 30000);
    crawl();

    return () => {
      clearInterval(interval);
    };
  }, [crawl]);

  useEffect(() => {
    if (hospital === undefined) return;
    let description = "";
    switch (i18n.language) {
      case "zh":
        description = `${t(hospital)}位於${HOSPITAL_ADDRESS[hospital][i18n.language]}，並提供 24 小時急症服務。如情況緊急，請致電 999 熱線或直撥消防處救護車調派中心 27353355 要求緊急救護服務。在可能情況下，如非嚴重傷病，市民應利用其他途徑往醫院求診。`;
        break;
      default:
        description = `${t(hospital)} is at ${HOSPITAL_ADDRESS[hospital][i18n.language]} and provide 24/7 medical service for accident & emergency. In case it is an emergency or injury, you can call the 999 Hotline or the Fire Services Communication Centre at 2735 3355 for emergency ambulance service. If circumstances permit and the condition is not too serious, you should go to the hospital by other means.`;
        break;
    }
    setSeoHeader({
      title: `${t(hospital ?? "")} - ${t("HK A&E Waiting Time")}`,
      description,
      lang: i18n.language,
    });
  }, [i18n.language]);

  if (hospital === undefined) {
    return null;
  }

  return (
    <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
      <Typography variant="h6">{t(hospital ?? "")}</Typography>
      <Typography variant="caption">
        {HOSPITAL_ADDRESS[hospital][i18n.language]}
      </Typography>
      <Typography variant="body1">
        {t("Top wait hours for past 12 hours")}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              fontWeight: 700,
              position: "sticky",
              top: 0,
              bgcolor: "white",
            }}
          >
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
                    ? // @ts-ignore
                      t(state.calculatedYesterdayWaitTimes[idx][1])
                    : t("Still waiting")}
                </TableCell>
                <TableCell>
                  {state.calculatedLastWeekWaitTimes[idx] &&
                  state.calculatedLastWeekWaitTimes[idx][1]
                    ? // @ts-ignore
                      t(state.calculatedLastWeekWaitTimes[idx][1])
                    : t("No data")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HospitalPage;

const DEFAULT_STATE: HospitalPageState = {
  calculatedWaitTimes: [],
  calculatedYesterdayWaitTimes: [],
  calculatedLastWeekWaitTimes: [],
};
