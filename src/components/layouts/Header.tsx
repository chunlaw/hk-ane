import { Box, Typography } from "@mui/material";
import "../../App.css";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const Header = () => {
  const { t, i18n } = useTranslation()

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")
  }, [i18n])

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
      <Typography variant="h5">{t("HK A&E Waiting Time")}</Typography>
      <Typography variant="body1" fontWeight="700" onClick={toggleLanguage} sx={{cursor: "pointer"}}>
        {i18n.language === "zh" ? "En" : "中"}
      </Typography>
    </Box>
  );
};

export default Header;
