import api from "./api";

export const login = async (formData) => {
  try {
    const response = await api.post("/auth/login/", formData);
    console.log(response);
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
  try {
    const response = await api.get("/auth/user/");
    return response;
  } catch (error) {
    // Log the error or handle it in any way
    console.error("Error fetching user:", error);
    // You can return a fallback or an empty object if needed
    return null;
  }
};

export const apiRefreshToken = async () => {
  const response = await api.post("/auth/token/refresh/");
  return response; // The backend should respond with a new access token and user data
};
