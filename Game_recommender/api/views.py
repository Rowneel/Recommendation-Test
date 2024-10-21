from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.staticfiles import finders
import numpy as np
import pandas as pd


def reduce_memory(df):
    for col in df.columns:
        if df[col].dtype == 'float64':
            df[col] = df[col].astype('float32')
        if df[col].dtype == 'int64':
            df[col] = df[col].astype('int32')
    return df


@api_view(['GET'])
def getData(request):
    # gettign data from csv file
    games_path = finders.find('src/games.csv')
    recommendations_path = finders.find('src/recommendations.csv')
    games = reduce_memory(pd.read_csv(games_path,usecols=["app_id","title","date_release","price_original"]))
    recommendations = reduce_memory(pd.read_csv(recommendations_path,usecols=["app_id","hours","user_id"], ))
    
    #merging the recommendations with the games data
    recommend_with_users = recommendations.merge(games,on='app_id')
    
    #finding the number of people that played the game
    no_of_ppl_played_df = recommend_with_users.groupby('app_id').count()['user_id'].reset_index()
    #replacing the user_id with the no_of_ppl for clarity
    no_of_ppl_played_df.rename(columns={'user_id':'no_of_ppl'},inplace=True)
    
    #finding the average time that the users have played the game
    hours_played_df = recommend_with_users.groupby('app_id')["hours"].mean().reset_index()
    #replacing the hours with mean_hours for clarity
    hours_played_df.rename(columns={'hours':'mean_hours'},inplace=True)
    
    #based on hours played sorted out the most played games based on average hours played by users on games that have more than 10000 players
    most_played_game_df = no_of_ppl_played_df.merge(hours_played_df,on='app_id')
    popular_games_df = most_played_game_df[most_played_game_df['no_of_ppl'] >= 10000].sort_values("mean_hours",ascending=False).head(10)
    
    
    #merging the popular_games_df with the games data to get the titles of the games
    top_games_df = popular_games_df.merge(games,on="app_id")
    
    #DataFrame to Dictionary conversion to get every game as dectionary
    games_list = top_games_df.to_dict(orient='records')
    return Response(games_list)