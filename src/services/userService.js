import api from "./api";

const token = localStorage.getItem("token");
export const signupUser = async (formData) => {
  try {
    const response = await api.post("/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

export const logoutUser = async (formdata) => {
  try {
    const response = await api.post(
      "/user/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response || { message: "Logout failed" };
  }
};

export const search_user = async (formdata) => {
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


export const auth_check = async (tokenn) => {
  try {
    const response = await api.get("user/authCheck", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message;
  }
};

export const edit_user = async (formdata) => {
  try {
    const response = await api.post("user/edit_user", formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message;
  }
};
