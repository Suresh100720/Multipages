import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Candidates from "../pages/Candidates/Candidates";

const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <BrowserRouter>
      <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
