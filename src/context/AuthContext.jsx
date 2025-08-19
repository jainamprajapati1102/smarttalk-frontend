import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { auth_check } from "../services/userService";

const token = cookie.get("token");
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");  // read from localStorage instead of cookie
    if (!token) {
      setLoading(false);
      return;
    }
  
    const checkAuth = async () => {
      try {
        const res = await auth_check(token);
        if (res.data.user) setUser(res.data.user);
        else setUser(null);
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token"); // Clean up invalid token
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
