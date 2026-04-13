import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import Settings from "../../pages/Settings/Settings";

const Layout = ({ darkMode, toggleTheme }) => {
  const [showSettings, setShowSettings] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setShowSettings(false);
  }, [pathname]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: darkMode ? "#0f172a" : "#f0f2f5",
      }}
    >
      {/* Sidebar — sticky */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}
      >
        <Sidebar darkMode={darkMode} onSettingsClick={() => setShowSettings(true)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <HeaderBar darkMode={darkMode} toggleTheme={toggleTheme} />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: darkMode ? "#0f172a" : "#f0f2f5",
            padding: "24px",
          }}
        >
          {showSettings ? (
            <Settings darkMode={darkMode} onClose={() => setShowSettings(false)} />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;