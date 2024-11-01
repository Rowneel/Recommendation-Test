import api from "./api";

export const apiFetchGamesDetails = async (id) => {
  const response = await api.get(`/api/appdetails/${id}`);
  return response;
};