import React, { useState } from "react";
import { loginUser } from "../services/userService";
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
        setUser(res.data.user);
        navigate("/chat");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          name="mobile"
          placeholder="Enter Mobile Number"
          className="w-full mb-4 p-2 border rounded"
          value={form.mobile}
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
        <p>
          <a href="/signup">
            If you don't have register?{" "}
            <span className="text-blue-500">Signup</span>
          </a>
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
