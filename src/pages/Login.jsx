import React, { useState } from "react";
import { auth_check, loginUser } from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ mobile: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const data = new FormData();
      data.append("mobile", form.mobile);
      const res = await loginUser(data);

      if (res.status === 200) {
        toast.success("User logged in successfully!");
        localStorage.setItem("loggedin", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        setUser(res.data.user);
        navigate("/chat");
      }
    } catch (err) {
      console.error(err);
      setError(err.msg || "Login failed: " + err.message);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2 sm:px-4">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-[90vw] sm:max-w-md md:max-w-lg text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
          Login
        </h2>

        <input
          type="text"
          name="mobile"
          placeholder="Enter Mobile Number"
          className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.mobile}
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-xs sm:text-sm mt-2 sm:mt-3">
          <a href="/signup" className="inline-block">
            If you don't have an account?{" "}
            <span className="text-blue-500 hover:underline">Sign up</span>
          </a>
        </p>
        {error && (
          <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3">
            {error}
          </p>
        )}
        {message && (
          <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
