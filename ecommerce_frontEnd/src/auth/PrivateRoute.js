import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";

const PrivateRoute = ({ children }) => {
  const auth = isAuthenticated();
  return auth ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
