import api from "./api";

export const create_chat_service = async (formdata) => {
  try {
    const response = await api.post("chat/create_chat", formdata);
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In Sending message" };
  }
};

export const get_Message_SelectedUser_services = async (formdata) => {
  try {
    const response = await api.post("chat/selectedUser_msg", formdata);
    return response;
  } catch (error) {
    throw error.message || { msg: "Error In fetch select user message" };
  }
};

export const msg_seen_service = async (formdata) => {
  try {
    const response = await api.post("chat/msg_seen", formdata);
    return response;
  } catch (error) {
    throw error.message || { msg: "Error in msg seen" };
  }
};

export const msg_delete_me_service = async (formdata) => {
  try {
    const response = await api.post("chat/msg_delete_me", formdata);
    return response;
  } catch (error) {
    throw error.message || { msg: "Error in msg delete for me " };
  }
};

export const msg_delete_all_service = async (formdata) => {
  try {
    const response = await api.post("chat/msg_delete_all", formdata);
    return response;
  } catch (error) {
    throw error.message || { msg: "Error in msg delete for all" };
  }
};
