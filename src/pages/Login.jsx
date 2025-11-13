// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Loader from "../components/Loader";

// const Login = () => {
//   const [form, setForm] = useState({ mobile: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const data = new FormData();
//       data.append("mobile", form.mobile);

//       const res = await loginUser(data);

//       if (res.status === 200) {
//         const { user, token } = res.data;

//         login(user, token); // store in context + localStorage

//         toast.success("User logged in successfully!");

//         navigate("/", { replace: true });
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.msg || "Login failed: " + err.message);
//     } finally {
//       setLoading(false); // ✅ always reset loading (success or error)
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2 sm:px-4">
//       {loading ? (
//         <Loader text="Logging in..." />
//       ) : (
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-[90vw] sm:max-w-md md:max-w-lg text-center">
//           <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
//             Login
//           </h2>

//           <input
//             type="text"
//             name="mobile"
//             placeholder="Enter Mobile Number"
//             className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={form.mobile}
//             onChange={handleChange}
//           />

//           <button
//             className="w-full bg-blue-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors"
//             onClick={handleLogin}
//             disabled={loading || !form.mobile}
//           >
//             {loading ? "Please wait..." : "Login"}
//           </button>

//           <p className="text-xs sm:text-sm mt-2 sm:mt-3">
//             Don&apos;t have an account?{" "}
//             <a href="/signup" className="text-blue-500 hover:underline">
//               Sign up
//             </a>
//           </p>

//           {error && (
//             <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3">
//               {error}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Login = () => {
  const [form, setForm] = useState({ mobile: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) navigate("/", { replace: true });
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, "");
    setForm((p) => ({ ...p, [e.target.name]: value }));
    setError("");
  };

  const isValidMobile = (val) => {
    const v = (val || "").trim();
    return /^\d{10}$/.test(v);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValidMobile(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      const normalized = form.mobile.replace(/^\+?91/, "");
      data.append("mobile", normalized);

      const res = await loginUser(data);

      if (res?.status === 200) {
        const { user, token } = res.data;
        login(user, token);
        toast.success("User logged in successfully!");
      } else {
        setError(res?.data?.msg || "Login failed. Please try again.");
      }
    } catch (err) {
      const serverMsg =
        err?.response?.data?.msg || err?.response?.data?.message;
      setError(serverMsg || err.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2 sm:px-4">
      {loading ? (
        <Loader text="Logging in..." />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-[90vw] sm:max-w-md md:max-w-lg text-center"
          aria-label="Login form"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
            Login
          </h2>

          <input
            autoFocus
            inputMode="tel"
            pattern="[0-9+]*"
            maxLength={13}
            type="tel"
            name="mobile"
            placeholder="Enter Mobile Number (10 digits)"
            className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.mobile}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? "mobile-error" : undefined}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
            disabled={loading || !isValidMobile(form.mobile)}
            aria-disabled={loading || !isValidMobile(form.mobile)}
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <p className="text-xs sm:text-sm mt-2 sm:mt-3">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

          {error && (
            <p
              id="mobile-error"
              className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3"
            >
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
};
export default Login;
