import { Box, Divider, List, ListItem, ListItemText, SxProps, Theme, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo } from "react";
import AppContext from "../../AppContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HOSPITAL_ADDRESS } from "../../constants";
import { format } from "date-fns";
import { setSeoHeader } from "../../utils";

interface HospitalMapInfoProps {
  hospital?: string;
}

const HospitalMapInfo = ({ hospital }: HospitalMapInfoProps) => {
  const {
    calculatedWaitTime,
    calculatedLastWeekWaitTime,
    calculatedYesterdayWaitTime,
    lastUpdateTime,
  } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/${i18n.language}/${hospital}`);
  }, [navigate, hospital]);

  useEffect(() => {
    if (hospital === undefined) {
      if (i18n.language === "zh") {
        setSeoHeader({
          title: "急症等候時間表 - 地圖",
          description:
            "盡覽香港公立醫院急症室等候時間，並輔以過去48小時、一周前的等候時間變化作參考",
          lang: i18n.language,
        });
      } else {
        setSeoHeader({
          title: "HK A&E Waiting Time - Map View",
          description:
            "All A&E service waiting time in HK public hospital, with  waiting data of last 48 hours and last week for reference",
          lang: i18n.language,
        });
      }
      return;
    }
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
      title: `${t(hospital)} - ${t("HK A&E Waiting Time")}`,
      description,
      lang: i18n.language,
    });
  }, [hospital, i18n.language]);

  const defaultContent = useMemo(() => {
    return Object.entries(calculatedWaitTime)
  }, [calculatedWaitTime])

  if (hospital === undefined || lastUpdateTime === null ) {
    if ( lastUpdateTime === null ) {
      return null;
    }
    return (
      <Box sx={rootSx} textAlign="left" overflow="hidden">
        <Typography variant="h6">{t("Head patient arrival time")}</Typography>
        <List sx={{flex: 1, overflow: "scroll"}}>
          {defaultContent.map(([hosp, wait], idx) => (
            <ListItem 
              key={idx} 
              sx={{py: 0, cursor: "pointer"}}
              onClick={() => navigate(`/${i18n.language}/map/${hosp}`)}
            >
              <ListItemText
                primary={t(wait)}
                secondary={t(hosp)}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  return (
    <Box sx={rootSx}>
      <Box textAlign="left" display="flex" flexDirection="column">
        <Typography variant="h5">{calculatedWaitTime[hospital]}</Typography>
        <Typography variant="caption">
          {t("Arrival time of the current head")}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box textAlign="left" display="flex" flexDirection="column">
        <Typography variant="h6">
          {calculatedYesterdayWaitTime[hospital]} {t("hours")}
        </Typography>
        <Typography variant="caption">
          {t("Yesterday real waiting time reference")}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box textAlign="left" display="flex" flexDirection="column">
        <Typography variant="h6">
          {calculatedLastWeekWaitTime[hospital]} {t("hours")}
        </Typography>
        <Typography variant="caption">
          {t("Last week real waiting time reference")}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box textAlign="right" display="flex" flexDirection="column">
        <Typography variant="caption">
          {t("Last updated time: ")}{" "}
          {format(new Date(lastUpdateTime), "hh:mma")}
        </Typography>
        <Typography variant="caption">{t(hospital)}</Typography>
        <Typography variant="caption" fontSize="0.6em">
          {t(HOSPITAL_ADDRESS[hospital][i18n.language])}
        </Typography>
        <Typography variant="caption" sx={linkSx} onClick={handleClick}>
          {t("More")}
        </Typography>
      </Box>
    </Box>
  );
};

export default HospitalMapInfo;

const rootSx: SxProps<Theme> = {
  position: "absolute",
  zIndex: 1000,
  top: 0,
  right: 0,
  maxHeight: "40dvh",
  maxWidth: 300,
  bgcolor: "white",
  p: 2,
  m: 1,
  display: "flex",
  flexDirection: "column",
};

const linkSx: SxProps<Theme> = {
  cursor: "pointer",
  color: (t) => t.palette.info.main,
  "&:hover": {
    fontWeight: 700,
  },
};
