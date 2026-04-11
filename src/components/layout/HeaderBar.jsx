import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/":           "Dashboard",
  "/candidates": "Candidates",
};

const HeaderBar = ({ darkMode, toggleTheme }) => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "Dashboard";

  const bg      = darkMode ? "#1e293b" : "#ffffff";
  const border  = darkMode ? "#27354a" : "#f1f5f9";
  const textCol = darkMode ? "#f1f5f9" : "#1e293b";

  return (
    <div
      style={{
        background: bg,
        borderBottom: `1px solid ${border}`,
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      {/* Page title */}
      <h1 style={{
        margin: 0,
        fontSize: 22,
        fontWeight: 800,
        color: textCol,
        letterSpacing: -0.5,
      }}>
        {title}
      </h1>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={darkMode ? "Switch to Light mode" : "Switch to Dark mode"}
        style={{
          width: 52,
          height: 28,
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: darkMode
            ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
            : "#e2e8f0",
          transition: "background .3s",
          outline: "none",
          flexShrink: 0,
        }}
      >
        {/* track icons */}
        <span style={{
          position: "absolute",
          left: 6,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 12,
          opacity: darkMode ? 1 : 0.3,
          transition: "opacity .3s",
          userSelect: "none",
        }}>
          🌙
        </span>
        <span style={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 12,
          opacity: darkMode ? 0.3 : 1,
          transition: "opacity .3s",
          userSelect: "none",
        }}>
          ☀️
        </span>
        {/* thumb */}
        <span style={{
          position: "absolute",
          top: 3,
          left: darkMode ? "calc(100% - 25px)" : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          transition: "left .25s cubic-bezier(.4,0,.2,1)",
          display: "block",
        }} />
      </button>
    </div>
  );
};

export default HeaderBar;