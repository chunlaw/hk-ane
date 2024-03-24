import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import HospitalPage from "./pages/HospitalPage";
import MapPage from "./pages/MapPage";
import WaitListPage from "./pages/WaitListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang" element={<Layout />}>
          <Route path=":hospital" element={<HospitalPage />} />
          <Route path="map/:hospital?" element={<MapPage />} />
          <Route path="list" element={<WaitListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/zh/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
