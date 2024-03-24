import { Box, Container, SxProps, Theme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Container fixed maxWidth="xl" disableGutters sx={rootSx}>
      <Header />
      <Box display="flex" flexDirection="column" flex={1} overflow="scroll">
        <Outlet />
      </Box>
      <Footer />
    </Container>
  );
};

export default Layout;

const rootSx: SxProps<Theme> = {
  height: "100dvh",
  width: "100dvw",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  py: 1,
  px: 2,
};
