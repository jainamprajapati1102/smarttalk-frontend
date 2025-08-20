// services/userService.js
import api from "./api";
import cookie from "js-cookie";

const token = localStorage.getItem("token");
export const signupUser = async (formData) => {
  try {
    const response = await api.post("/user/signup", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};
export const loginUser = async (formData) => {
  try {
    const response = await api.post("/user/signin", formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/user/logout", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.response || { message: "Logout failed" };
  }
};

export const search_user = async (formdata, tokenn) => {
  try {
    const response = await api.post("/user/search_user", formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In Search User" };
  }
};

export const fetch_chat = async (tokenn) => {
  try {
    const response = await api.get("chat/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    // console.log(error);
    throw error.message || { msg: "Error In exist msg" };
  }
};

export const auth_check = async (tokenn) => {
  try {
    const response = await api.get("user/authCheck", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenn}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message;
  }
};
