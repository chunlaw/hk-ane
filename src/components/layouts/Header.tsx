import { Box, Button, IconButton, SxProps, Typography } from "@mui/material";
import "../../App.css";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Theme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import {
  GitHub as GitHubIcon,
  MapOutlined as MapIcon,
  ListAlt as ListIcon,
} from "@mui/icons-material";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");
  }, [i18n]);

  const handleNavigate = useCallback(
    (page: "map" | "list") => () => {
      navigate(`/${i18n.language}/${page}`);
    },
    [navigate, i18n.language],
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Typography variant="h5" sx={titleSx} onClick={handleNavigate("map")}>
        {t("HK A&E Waiting Time")}
      </Typography>
      <Box>
        <Button
          startIcon={<MapIcon />}
          color="inherit"
          onClick={handleNavigate("map")}
        >
          {t("Map")}
        </Button>
        <Button
          startIcon={<ListIcon />}
          color="inherit"
          onClick={handleNavigate("list")}
        >
          {t("List")}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={() => {
            window.open("https://github.com/chunlaw/ane-hk", "_blank");
          }}
          size="small"
        >
          <GitHubIcon />
        </IconButton>
        <Typography
          variant="body1"
          fontWeight="700"
          onClick={toggleLanguage}
          sx={{ cursor: "pointer" }}
        >
          {i18n.language === "zh" ? "En" : "中"}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;

const titleSx: SxProps<Theme> = {
  cursor: "pointer",
};
