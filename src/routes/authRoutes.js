import { Navigate } from "react-router-dom";

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};