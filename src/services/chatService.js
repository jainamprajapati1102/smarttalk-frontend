import api from "./api";
import cookie from "js-cookie";

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
