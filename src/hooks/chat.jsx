import api from "../api5"

export const uploadChatMessage = (formData) =>
  api.post("chat/upload/", formData);
