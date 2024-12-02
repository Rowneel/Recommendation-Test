import api from "./api";

export const apiFetchGamesDetails = async (id) => {
  const response = await api.get(`/api/app_details/${id}`);
  return response;
};

export const apiFetchRecommendationsDesc = async (title) =>{
  const response = await api.get(`/api/recommendation_description/${title}`);
  return response;
}

export const apiFetchPopularGames = async () => {
  const response = await api.get(`/api/popular_games`);
  return response;
}