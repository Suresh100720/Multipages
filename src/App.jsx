import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { ConfigProvider, theme } from "antd";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode((d) => !d);

  return (
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
      <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
    </ConfigProvider>
  );
};

export default App;