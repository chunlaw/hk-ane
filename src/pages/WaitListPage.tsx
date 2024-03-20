import {
  Box,
  Table,
  Typography,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import { AVAILABLE_HOSPITALS, DayTimePoint, Hospital } from "ane-hk";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

interface WaitListPageState {
  isLoading: boolean;
  waitTime: Record<string, Partial<Record<DayTimePoint, string>>>;
}

const WaitListPage = () => {
  const [state, setState] = useState<WaitListPageState>(DEFAULT_STATE);
  const { aneHk } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const crawl = useCallback(() => {
    const curDate = new Date();
    curDate.setMinutes(curDate.getMinutes() - 10);
    Promise.all(
      AVAILABLE_HOSPITALS.en.map((hosp) =>
        aneHk
          .getLatestWaitingTime(hosp as Hospital)
          .then(
            (r) => [hosp, r] as [string, Partial<Record<DayTimePoint, string>>],
          )
          .catch(
            () => [hosp, {}] as [string, Partial<Record<DayTimePoint, string>>],
          ),
      ),
    ).then((res) => {
      setState({
        isLoading: false,
        waitTime: res.reduce(
          (acc, [hosp, ret]) => {
            acc[hosp as string] = ret;
            return acc;
          },
          {} as Record<string, Partial<Record<DayTimePoint, string>>>,
        ),
      });
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(crawl, 60000);
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

  const lastUpdateTime = useMemo<string>(() => {
    const entries = Object.entries(state.waitTime);
    if (entries.length) {
      return Object.keys(entries[0][1]).slice(-1)[0];
    }
    return "";
  }, [state]);

  return (
    <Box
      flex={1}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <Typography variant="caption">
        {t("Last updated time: ")} {lastUpdateTime}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Hospital")}</TableCell>
            <TableCell>{t("Waiting time reference")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(state.waitTime).map(([hospName, topWait]) => (
            <TableRow key={hospName}>
              <TableCell>
                <Box
                  onClick={handleClick(hospName as Hospital)}
                  sx={{ cursor: "pointer" }}
                >
                  {t(hospName)}
                </Box>
              </TableCell>
              <TableCell>{t(Object.values(topWait).slice(-1)[0])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default WaitListPage;

const DEFAULT_STATE: WaitListPageState = {
  isLoading: true,
  waitTime: {},
};
