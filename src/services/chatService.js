import api from "./api";
const token = localStorage.getItem("token");

export const accessChatService = async (formdata) => {
  try {
    const response = await api.post("chat/", formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetch_chat = async (page = 1, limit = 2) => {
  try {
    const response = await api.get(
      `/chat?page=${page}&limit=${limit}`,
      // { params: { page, limit } },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    // console.log(error);
    throw error.message || { msg: "Error In exist msg" };
  }
};

export const createGroupChatService = async (data) => {
  try {
    const response = await api.post("/chat/group", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In group creation" };
  }
};
