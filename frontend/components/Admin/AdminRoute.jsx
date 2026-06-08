import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { userInfo, loading, authChecked } = useSelector((state) => state.auth);

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!userInfo) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (userInfo.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
