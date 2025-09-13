import api from "./api";
const token = localStorage.getItem("token");
export const create_message_service = async (formdata) => {
  try {
    const response = await api.post("message/create_message", formdata, {
      headers: {
        "Content-Type": "multipart/form-data", // only here!
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In Sending message" };
  }
};

export const get_Message_SelectedUser_services = async (
  chatId,
  { skip = 0, limit = 20 }
) => {
  try {
    const response = await api.get(
      `message/${chatId}/?page=${skip}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In fetch select user message" };
  }
};

export const msg_seen_service = async (formdata) => {
  try {
    const response = await api.post("message/msg_seen", formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message || { msg: "Error in msg seen" };
  }
};

export const msg_delete_me_service = async (formdata) => {
  try {
    const response = await api.post("message/msg_delete_me", formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message || { msg: "Error in msg delete for me " };
  }
};

export const msg_delete_everyone_service = async (formdata) => {
  try {
    const response = await api.post("message/msg_delete_all", formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.message || { msg: "Error in msg delete for all" };
  }
};
