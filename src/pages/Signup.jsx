// pages/Signup.jsx
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
      if (profilePic) data.append("profile", profilePic);

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative bg-white p-6 pt-20 rounded-xl shadow-md w-80 text-center">
        {/* Profile Uploader */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <ProfileUploader image={profilePic} setImage={setProfilePic} />
        </div>

        {/* Form Fields */}
        <h2 className="text-xl font-bold mt-20 mb-3">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={submitHandler}
        >
          Sign Up
        </button>
        <p>
          <a href="/login">
            If you have already register? <span className="text-blue-500">Signin</span>
          </a>
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
