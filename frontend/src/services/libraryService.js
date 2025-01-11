import api from "./api";

export const apiFetchLibrary = async () => {
    const response = await api.get(`/api/get_UserLibrary`);
    return response;
  }
  
  export const apiUpdateLibrary = async (formData) => {
    const response = await api.post(`/api/post_UserLibrary`, formData);
    return response;
  }