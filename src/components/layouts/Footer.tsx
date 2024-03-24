import { Box, SxProps, Theme, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={rootSx}>
      <Typography variant="caption" 
        onClick={() => window.open("https://github.com/sponsors/chunlaw", "_blank")}
        sx={linkSx}
      >
        Chun Law &nbsp;
      </Typography>
      <Typography variant="caption">
         @ {new Date().getFullYear()}
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

const linkSx: SxProps<Theme> = {
  cursor: "pointer",
}