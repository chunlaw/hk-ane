import { Box, SxProps, Theme, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={rootSx}>
      <Typography variant="caption">
        Chun Law © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;

const rootSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
