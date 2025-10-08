import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateAdminRoute;
