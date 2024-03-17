import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Box 
        height="100dvh" 
        width="90dvw"
        display="flex" 
        flexDirection="column" 
        justifyContent="space-between" 
        pt={1}
      >
        <Header />
        <Box 
          display="flex" 
          flexDirection="column" 
          flex={1}
          overflow="scroll"
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Container>
  );
};

export default Layout;
