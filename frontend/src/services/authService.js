import api from "./api";

export const login = async (formData) => {
  try {
    const response = await api.post("/auth/login/", formData);
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const register = async (formData) => {
  const response = await api.post("/api/register", formData);
  return response;
};

export const logout = async () => {
  const response = await api.post("/auth/logout/");
  return response;
};

export const fetchUser = async () => {
    const response = await api.get("/auth/user/");
    return response;
};

export const apiRefreshToken = async () => {
  const response = await api.post("/auth/token/refresh/");
  return response; // The backend should respond with a new access token and user data
};
