// import { Outlet, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import React from "react";
// const ProtectedRoute = () => {
//   const { user, loading } = useAuth();
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   return user ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
