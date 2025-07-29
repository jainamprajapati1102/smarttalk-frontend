import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null); // ✅ This ensures reset
        }
      } catch (error) {
        setUser(null); // ✅ Handle error properly
      } finally {
        setLoading(false); // ✅ this was `null` in your original, that causes blank screen
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
