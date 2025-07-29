// services/userService.js
import api from "./api";

export const signupUser = async (formData) => {
  try {
    const response = await api.post("/user/signup", formData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};
export const loginUser = async (formData) => {
  try {
    const response = await api.post("/user/signin", formData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/user/logout");
    return response; // ✅ so we can use status
  } catch (error) {
    throw error.response || { message: "Logout failed" };
  }
};

export const search_user = async (formdata) => {
  try {
    const response = await api.post("user/search_user", formdata);
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In Search User" };
  }
};

export const exist_msg = async (formdata) => {
  try {
    const response = await api.post("chat/exist_msg", formdata);
    return response;
  } catch (error) {
    console.log(error);
    throw error.message || { msg: "Error In exist msg" };
  }
};
