import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5", // Indigo
          fontFamily: "Poppins, sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);