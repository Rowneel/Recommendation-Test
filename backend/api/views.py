from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.staticfiles import finders
from django.db import IntegrityError
import requests
from django.http import JsonResponse
import pandas as pd
import numpy as np
import pickle

from rest_framework import status
# from api.models import Game,Recommendation
# from . import models
# from api.serializers import GameSerializer,RecommendationSerializer
import numpy as np
import pandas as pd
from django.contrib.auth.models import User,auth


def reduce_memory(df):
    for col in df.columns:
        if df[col].dtype == 'float64':
            df[col] = df[col].astype('float32')
        if df[col].dtype == 'int64':
            df[col] = df[col].astype('int32')
    return df

#CODE WHILE USE DATABASE ISTEAD OF CSV

# @api_view(['GET'])
# def getData(request):
#     #get game and recommendation data from database after importing csv file into the database
#     game_data = Game.objects.all().values("app_id","title","date_release","price_original")
#     game_df = pd.DataFrame(game_data)
#     # print(game_df)
    
#     recommendation_data = Recommendation.objects.all().values("app_id","hours","user_id")
#     recommendation_df = pd.DataFrame(recommendation_data)
#     # print(recommendation_df)
    
#     #merging the dataframes
#     recommend_with_users = recommendation_df.merge(game_df,on='app_id')

#     # print(recommend_with_users)
    
#     #finding the number of people that played the game
#     no_of_ppl_played_df = recommend_with_users.groupby('app_id').count()['user_id'].reset_index()
#     #replacing the user_id with the no_of_ppl for clarity
#     no_of_ppl_played_df.rename(columns={'user_id':'no_of_ppl'},inplace=True)
    
    
    
#     #finding the average time that the users have played the game
#     hours_played_df = recommend_with_users.groupby('app_id')["hours"].mean().reset_index()
#     #replacing the hours with mean_hours for clarity
#     hours_played_df.rename(columns={'hours':'mean_hours'},inplace=True)
    
    
#     #based on hours played sorted out the most played games based on average hours played by users on games that have more than 10000 players
#     most_played_game_df = no_of_ppl_played_df.merge(hours_played_df,on='app_id')
#     popular_games_df = most_played_game_df[most_played_game_df['no_of_ppl'] >= 10000].sort_values("mean_hours",ascending=False).head(10)
    
#     #merging the popular_games_df with the games data to get the titles of the games
#     top_games_df = popular_games_df.merge(game_df,on="app_id")
    
    
#     #DataFrame to Dictionary conversion to get every game as dictionary
#     games_list = top_games_df.to_dict(orient='records')
#     return Response(games_list)
    
    
    
#     #for serializer.....
    
# #     games = Game.objects.all().values()[:10]  # Fetch all games
# #     serializer = GameSerializer(games, many=True)  # Serialize the games data
# #     return Response(serializer.data)  # Return the serialized data as JSON


#CODE WHILE USING CSV
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

# @api_view(['POST'])
# def login(request):
#     username = request.data.get("username")
#     password = request.data.get('password')
#     user = auth.authenticate(username=username, password=password)    
#     if user is not None:
#         auth.login(request, user)
#         response =  Response({"message": "User logged in successfully"})
#         print(response.data)
#         return response
    
@api_view(['POST'])
def register(request):
    username = request.data.get('username', "")
    email = request.data.get('email', "")
    password = request.data.get('password', "")
    first_name = request.data.get('first_name', "")
    last_name = request.data.get('last_name', "")

    # Basic validation
    if not username or not email or not password:
        return Response({"error": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the username or email already exists
    if User.objects.filter(username=username).exists():
        return Response({"error": "The username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "The email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password,first_name = first_name, last_name= last_name)
        user.save()
        response =  Response({"message": "User created successfully"})
        print(response.data)
        return response
    except IntegrityError:
        return Response({"error": "Failed to create user. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # More appropriate for unexpected errors

# @api_view(['GET'])
# def logout(request):
#     auth.logout(request)
#     return Response({"message": "User logged out successfully"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test(request):
    return Response({"message": "You are authenticated"})


@api_view(['GET'])
def app_details_view(request, app_id):
    steam_api_url = f'https://store.steampowered.com/api/appdetails?appids={app_id}'
    
    try:
        response = requests.get(steam_api_url)
        response_data = response.json()

        if response_data[str(app_id)]['success']:
            return JsonResponse(response_data[str(app_id)]['data'], status=200)
        else:
            return JsonResponse({"error": "App not found"}, status=404)

    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)
    


@api_view(['GET'])
def recommendation_by_description(request,game):
    games_path = finders.find('src/final_games_data_forDesc.csv') 
    games = reduce_memory(pd.read_csv(games_path))
    n_recommendation = 20
    similarity_pickle_path = finders.find('src/similarity_forDesc.pkl')
    similarity=pickle.load(open(similarity_pickle_path,'rb'))

    index = games[games['title'] == game].index[0]
    sim_scores = sorted(list(enumerate(similarity[index])),reverse=True,key = lambda x: x[1])
    game_lists=[]
    for i in sim_scores[1:n_recommendation]:
        game_lists.append(games.iloc[i[0]].title)
    return Response(game_lists)

# recommend('Call of Duty®: Black Ops Cold War')