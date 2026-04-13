import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserAddOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const NAV = [
  { to: "/", label: "Dashboard", icon: <DashboardOutlined /> },
  { to: "/candidates", label: "Candidates", icon: <UserAddOutlined /> },
  { to: "/jobs", label: "Jobs", icon: <AppstoreAddOutlined /> },
];

const Sidebar = ({ darkMode, onSettingsClick }) => {
  const { pathname } = useLocation();

  const bg      = darkMode ? "#0f172a" : "#1e293b";
  const textCol = "#94a3b8";
  const active  = "#6366f1";

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
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>
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

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map(({ to, label, icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : textCol,
                background: isActive
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : "transparent",
                textDecoration: "none",
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
            </Link>
          );
        })}
      </nav>

      {/* Settings Button (State-based) */}
      <div style={{ padding: "0 10px 10px" }}>
        <button
          onClick={onSettingsClick}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            color: textCol,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all .2s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#27354a";
            e.currentTarget.style.color = "#f1f5f9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = textCol;
          }}
        >
          <span style={{ fontSize: 16 }}><SettingOutlined /></span>
          Settings
        </button>
      </div>

      {/* Footer hint */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ fontSize: 11, color: "#334155", textAlign: "center" }}>
          v1.0 · Candidate CRM
        </div>
      </div>
    </div>
  );
};

export default Sidebar;