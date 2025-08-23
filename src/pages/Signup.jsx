import React, { useState } from "react";
import ProfileUploader from "../components/ProfileUploader";
import { signupUser } from "../services/userService";
import { toast } from "react-toastify";

const Signup = () => {
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("mobile", form.mobile);
      if (profilePic) data.append("profilePic", profilePic);

      const res = await signupUser(data);

      if (res.status === 200) {
        toast.success("User created successfully!");
        setMessage("User created successfully");
        setError("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.msg || "Signup failed");
      setError(err.msg);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2 sm:px-4">
      <div className="relative bg-white p-4 sm:p-6 pt-16 sm:pt-20 rounded-xl shadow-md w-full max-w-[90vw] sm:max-w-md md:max-w-lg">
        {/* Profile Uploader */}
        <div className="absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2">
          <ProfileUploader image={profilePic} setImage={setProfilePic} />
        </div>

        {/* Form Fields */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-16 sm:mt-20 mb-3 sm:mb-4 text-center">
          Sign Up
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className="w-full mb-2 sm:mb-3 p-2 sm:p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
        />

        <button
          className="w-full bg-green-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors"
          onClick={submitHandler}
        >
          Sign Up
        </button>
        <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-center">
          <a href="/login" className="inline-block">
            If you have already registered?{" "}
            <span className="text-blue-500 hover:underline">Sign in</span>
          </a>
        </p>
        {error && (
          <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
            {error}
          </p>
        )}
        {message && (
          <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
