import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const Layout = ({ children, darkMode, toggleTheme }) => {
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
        <Sidebar darkMode={darkMode} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <HeaderBar darkMode={darkMode} toggleTheme={toggleTheme} />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: darkMode ? "#0f172a" : "#f0f2f5",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;