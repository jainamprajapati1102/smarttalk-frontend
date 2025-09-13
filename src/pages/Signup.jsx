// import React, { useState } from "react";
// import ProfileUploader from "../components/ProfileUploader";
// import { signupUser } from "../services/userService";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// const Signup = () => {
//   const [form, setForm] = useState({ name: "", mobile: "" });
//   const [profilePic, setProfilePic] = useState(null);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submitHandler = async () => {
//     try {
//       const data = new FormData();
//       data.append("name", form.name);
//       data.append("mobile", form.mobile);
//       if (profilePic) data.append("profilePic", profilePic);

//       const res = await signupUser(data);

//       if (res.status === 200) {
//         toast.success("User created successfully!");
//         setMessage("User created successfully");
//         setError("");
//       } else {
//         toast.error("Something went wrong");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.msg || "Signup failed");
//       setError(err.msg);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2 sm:px-4">
//       <div className="relative bg-white p-4 sm:p-6 pt-16 sm:pt-20 rounded-xl shadow-md w-full max-w-[90vw] sm:max-w-md md:max-w-lg">
//         {/* Profile Uploader */}
//         <div className="absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2">
//           <ProfileUploader image={profilePic} setImage={setProfilePic} />
//         </div>

//         {/* Form Fields */}
//         <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-16 sm:mt-20 mb-3 sm:mb-4 text-center">
//           Sign Up
//         </h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Your Name"
//           className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="mobile"
//           placeholder="Mobile Number"
//           className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
//           onChange={handleChange}
//         />

//         <button
//           className="w-full bg-green-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors"
//           onClick={submitHandler}
//         >
//           Sign Up
//         </button>
//         <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-center">
//           <Link to="/login" className="inline-block">
//             If you have already registered?{" "}
//             <span className="text-blue-500 hover:underline">Sign in</span>
//           </Link>
//         </p>
//         {error && (
//           <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
//             {error}
//           </p>
//         )}
//         {message && (
//           <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileUploader from "../components/ProfileUploader";
import { signupUser } from "../services/userService";
import { toast } from "react-toastify";

 const  Signup=()=> {
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // allow only numbers and + for mobile
    if (name === "mobile") {
      const cleaned = value.replace(/[^0-9+]/g, "");
      setForm((p) => ({ ...p, [name]: cleaned }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
    setError("");
    setMessage("");
  };

  const isValidMobile = (val) => {
    const v = (val || "").trim();
    return /^\+?91?\d{10}$/.test(v);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!isValidMobile(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      const normalizedMobile = form.mobile.replace(/^\+?91/, "");
      data.append("mobile", normalizedMobile);
      if (profilePic) data.append("profilePic", profilePic);

      const res = await signupUser(data);

      if (res?.status === 200) {
        toast.success("User created successfully!");
        setMessage("User created successfully. Redirecting to login...");
        setError("");
        // small delay so user sees message (optional), then redirect
        setTimeout(() => navigate("/login", { replace: true }), 900);
      } else {
        const serverMsg = res?.data?.msg || res?.data?.message || "Something went wrong";
        setError(serverMsg);
        toast.error(serverMsg);
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.msg || err?.response?.data?.message;
      setError(serverMsg || err.message || "Signup failed");
      toast.error(serverMsg || "Signup failed");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-4 sm:p-6 pt-20 sm:pt-24 rounded-xl shadow-md w-full max-w-[90vw] sm:max-w-md md:max-w-lg"
        aria-label="Signup form"
      >
        <div className="absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2">
          <ProfileUploader image={profilePic} setImage={setProfilePic} />
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center">Sign Up</h2>

        <input
          name="name"
          type="text"
          placeholder="Your Name"
          className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          aria-label="Full name"
        />

        <input
          name="mobile"
          type="tel"
          inputMode="tel"
          pattern="[0-9+]*"
          maxLength={13}
          placeholder="Mobile Number (10 digits)"
          className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.mobile}
          onChange={handleChange}
          aria-label="Mobile number"
        />

        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className="w-full bg-green-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-center">
          <Link to="/login" className="inline-block">
            If you have already registered? <span className="text-blue-500 hover:underline">Sign in</span>
          </Link>
        </p>

        {error && (
          <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3 text-center">{error}</p>
        )}

        {message && (
          <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3 text-center">{message}</p>
        )}
      </form>
    </div>
  );
}
export default Signup