import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Candidates from "../pages/Candidates/Candidates";
import Jobs from "../pages/Jobs/Jobs";
import AIAssistant from "../pages/AIAssistant/AIAssistant";
import ErrorBoundary from "../components/ui/ErrorBoundary";

const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout darkMode={darkMode} toggleTheme={toggleTheme} />}>
            <Route index element={<Dashboard darkMode={darkMode} />} />
            <Route path="candidates" element={<Candidates darkMode={darkMode} />} />
            <Route path="jobs" element={<Jobs darkMode={darkMode} />} />
            <Route path="ai-assistant" element={<AIAssistant darkMode={darkMode} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppRoutes;
