/**
 * EXAMPLE: AppWithStateNavigation
 * This file shows how to use state-based page navigation instead of React Router.
 * Keep your current router setup in App.jsx, and use this as a reference/example.
 * 
 * To implement state-based navigation:
 * 1. Keep state for current page
 * 2. Render different pages based on state
 * 3. Update sidebar/navigation to handle state changes
 */

import { useState } from "react";
import Dashboard from "../pages/Dashboard/Dashboard";
import Candidates from "../pages/Candidates/Candidates";
import Jobs from "../pages/Jobs/Jobs";
import Settings from "../pages/Settings/Settings";
import { ConfigProvider, theme } from "antd";
import { AppContextProvider } from "../context/AppContext";
import Sidebar from "../components/layout/Sidebar";
import HeaderBar from "../components/layout/HeaderBar";

const AppWithStateNavigation = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard"); // State instead of URL routing

  const toggleTheme = () => setDarkMode((d) => !d);

  // Map state to page components
  const pageMap = {
    dashboard: <Dashboard darkMode={darkMode} />,
    candidates: <Candidates darkMode={darkMode} />,
    jobs: <Jobs darkMode={darkMode} />,
    settings: <Settings darkMode={darkMode} />,
  };

  return (
    <AppContextProvider>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#6366f1",
            borderRadius: 8,
            fontFamily: "Inter, Poppins, sans-serif",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            background: darkMode ? "#0f172a" : "#f0f2f5",
          }}
        >
          {/* Sidebar with state-based navigation */}
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
            <SidebarWithState darkMode={darkMode} currentPage={currentPage} onPageChange={setCurrentPage} />
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
              {/* Render page based on state */}
              {pageMap[currentPage]}
            </div>
          </div>
        </div>
      </ConfigProvider>
    </AppContextProvider>
  );
};

/**
 * Example Sidebar component for state-based navigation
 */
const SidebarWithState = ({ darkMode, currentPage, onPageChange }) => {
  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "candidates", label: "Candidates", icon: "👥" },
    { key: "jobs", label: "Jobs", icon: "💼" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  const bg = darkMode ? "#0f172a" : "#1e293b";
  const textCol = "#94a3b8";
  const active = "#6366f1";

  return (
    <div
      style={{
        height: "100%",
        background: bg,
        padding: "0 0 16px",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${darkMode ? "#1e293b" : "#27354a"}`,
      }}
    >
      {/* Brand */}
      <div style={{ padding: "22px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🚀
          </div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>
              Admin Panel
            </div>
            <div style={{ color: "#475569", fontSize: 11 }}>Management System</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#27354a", margin: "0 14px 14px" }} />

      {/* Nav items - state-based */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map(({ key, label, icon }) => {
          const isActive = currentPage === key;
          return (
            <button
              key={key}
              onClick={() => onPageChange(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : textCol,
                background: isActive ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all .2s",
                boxShadow: isActive ? "0 4px 14px rgba(99,102,241,0.4)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#27354a";
                  e.currentTarget.style.color = "#f1f5f9";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = textCol;
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppWithStateNavigation;
