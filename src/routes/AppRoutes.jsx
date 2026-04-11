import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";

const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <BrowserRouter>
      <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Dashboard darkMode={darkMode} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
