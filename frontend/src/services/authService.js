import api from "./api";

export const login = async (formData) => {
    const response = await api.post("/auth/login/", formData);
    return response;
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
    const response = await api.get("/api/user");
    return response;
};

export const apiRefreshToken = async () => {
  const response = await api.post("/auth/token/refresh/");
  return response; // The backend should respond with a new access token and user data
};


export const changePassword = async (formData) =>{
  const response = await api.post("/auth/password/change/", formData);
  return response;
}

export const uploadAvatar = async (formData) =>{
  const response = await api.put("/api/update_avatar", formData);
  return response;
}

export const updateProfile = async (formData) =>{
  const response = await api.put("/api/update_user", formData);
  return response;
}