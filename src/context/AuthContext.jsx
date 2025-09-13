// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { auth_check } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await auth_check(storedToken);
        if (res.data.user) {
          setUser(res.data.user);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("loggedin", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token); // ✅ make token available immediately
  };

  const logout = () => {
    localStorage.removeItem("loggedin");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
