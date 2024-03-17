import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import WaitListPage from "./pages/WaitListPage";
import HospitalPage from "./pages/HospitalPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang" element={<Layout />}>
          <Route path=":hospital" element={<HospitalPage />} />
          <Route path="" element={<WaitListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/zh" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
