import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Chatroom from "./pages/ChatRoom.jsx";
import AuthLayout from "./layouts/authLayout.jsx";
import MainLayout from "./layouts/mainLayout.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuestRoute from "./routes/GuestRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}

        {/* Public (Guest) Pages */}
        <Route element={<AuthLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

        {/* Protected Pages */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chatroom />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
