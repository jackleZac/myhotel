import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { authToken, userRole } = useContext(AuthContext);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!authToken) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }

  // Redirect to a forbidden message if role doesn't match
  if (requiredRole && userRole !== requiredRole) {
    return <div>Access Denied: You do not have permission to view this page.</div>;
  }

  // If authenticated and role is valid, render the child component
  return children;
}

export default ProtectedRoute;
