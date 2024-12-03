# import pandas as pd
# from .utils import get_game_recommendations

# # Load the DataFrames
# mapped_df = pd.read_pickle('path/to/mapped_df.pkl')
# game_similarity_df = pd.read_pickle('path/to/game_similarity_df.pkl')

# # Example Usage
# def recommend_games(request):
#     game_name = 'Game A'  # Example input
#     recommendations = get_game_recommendations(game_name, 2, game_similarity_df, filtered_df_player_count)
#     return JsonResponse({'recommendations': recommendations})



def get_game_recommendations(game_name, n, game_similarity_df, mapped_df):
    # Check if the game name exists in the filtered_df_player_count
    if game_name not in mapped_df['title'].values:
        return "No recommendations"
    
    # Get the app_id of the input game
    app_id = mapped_df.loc[mapped_df['title'] == game_name, 'app_id'].values[0]
    
    # Check if the app_id is in the similarity matrix
    if app_id not in game_similarity_df.index:
        return "No recommendations"
    
    # Get similarity scores for the game and sort them in descending order
    similarity_scores = game_similarity_df.loc[app_id].sort_values(ascending=False)
    
    # Get top n similar app_ids (excluding the game itself)
    top_app_ids = similarity_scores.iloc[1:n+1].index  # Exclude the first as it's the game itself
    
    # Map app_ids to game titles
    recommendations = mapped_df[mapped_df['app_id'].isin(top_app_ids)]['title'].tolist()
    
    return recommendations

print(get_game_recommendations('Dota 2', 5, game_similarity_df, mapped_df))
# Output: ['Game B', 'Game C']