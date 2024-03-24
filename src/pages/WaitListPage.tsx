import {
  Box,
  Table,
  Typography,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import { AVAILABLE_HOSPITALS, Hospital } from "ane-hk";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { WaitMsg } from "ane-hk/dist/types";
import { format } from "date-fns";
import { HOSPITAL_ADDRESS } from "../constants";
import { setSeoHeader } from "../utils";

interface WaitListPageState {
  calculatedWaitTime: Record<string, string>;
  calculatedYesterdayWaitTime: Record<string, WaitMsg | undefined>;
  calculatedLastWeekWaitTime: Record<string, WaitMsg | undefined>;
  lastUpdateTime: Date | null;
}

const WaitListPage = () => {
  const [state, setState] = useState<WaitListPageState>(DEFAULT_STATE);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const crawl = useCallback(async () => {
    fetch("https://raw.githubusercontent.com/chunlaw/ane-hk/cache/cache.json")
      .then((r) => r.json())
      .then(setState);
  }, []);

  useEffect(() => {
    const timer = setInterval(crawl, 300000);
    crawl();

    setSeoHeader(
      i18n.language === "zh"
        ? {
            title: "急症等候時間表",
            description: "即時公立醫院急症等候時間表 - 輔以歷史數據作參考",
            lang: i18n.language,
          }
        : {
            title: "A&E Waiting Time Dashboad",
            description:
              "Real time A&E waiting time dashboard, with historical data for reference",
            lang: i18n.language,
          },
    );

    return () => {
      clearInterval(timer);
    };
  }, [crawl, i18n.language]);

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
      <Table>
        <TableHead sx={{ position: "sticky", top: 0, bgcolor: "white" }}>
          <TableRow>
            <TableCell rowSpan={2}>{t("Hospital")}</TableCell>
            <TableCell rowSpan={2}>
              {t("Arrival time of the current head")}
              <br />
              {state.lastUpdateTime && (
                <Typography variant="caption">
                  {t("Last updated time: ")}{" "}
                  {format(state.lastUpdateTime, "hh:mm a")}
                </Typography>
              )}
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
                  <Typography variant="body1">{t(hospName)}</Typography>
                  <Typography variant="caption">
                    {t(HOSPITAL_ADDRESS[hospName][i18n.language])}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{state.calculatedWaitTime[hospName]}</TableCell>
              <TableCell>
                {t(state.calculatedYesterdayWaitTime[hospName] ?? "No data")}
              </TableCell>
              <TableCell>
                {t(state.calculatedLastWeekWaitTime[hospName] ?? "No data")}
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
  lastUpdateTime: null,
};
