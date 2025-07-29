import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";
const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? <Navigate to="/chat" /> : <Outlet />;
};

export default GuestRoute;
