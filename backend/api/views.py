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
from sklearn.metrics.pairwise import cosine_similarity
import re
import json

from rest_framework import status
# from api.models import Game,Recommendation
from api.models import UserLibrary
from api.serializers import UserLibrarySerializer
# from api.serializers import GameSerializer,RecommendationSerializer
import numpy as np
import pandas as pd
from django.contrib.auth.models import User,auth
from django.core.cache import cache
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer



def reduce_memory(df):
    for col in df.columns:
        if df[col].dtype == 'float64':
            df[col] = df[col].astype('float32')
        if df[col].dtype == 'int64':
            df[col] = df[col].astype('int32')
    return df


# def get_similarity_from_cache():
#     similarity = cache.get('similarity_matrix')
#     if similarity is None:
#         similarity_pickle_path = finders.find('src/similarity_forDesc.pkl')
#         similarity=pickle.load(open(similarity_pickle_path,'rb'))
#         cache.set('similarity_matrix', similarity, timeout=3600)  # Cache for 1 hour
#     return similarity

def get_vectors_from_cache():
    vectors = cache.get('vectors_final')
    if vectors is None:
        vectors_final_pickle_path = finders.find('src/vectors_final.pkl')
        vectors=pickle.load(open(vectors_final_pickle_path,'rb'))
        cache.set('vectors_final', vectors, timeout=3600)  # Cache for 1 hour
    return vectors

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
def getPopularGames(request):
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
    popular_games_df = most_played_game_df[most_played_game_df['no_of_ppl'] >= 1000].sort_values("mean_hours",ascending=False).head(50) 
    
    
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
    games_path = finders.find('src/final_dataset.csv') 
    games = reduce_memory(pd.read_csv(games_path))
    n_recommendation = 20
    # similarity = get_similarity_from_cache()
    index = games[games['title'] == game].index[0]
    vectors = get_vectors_from_cache()
    item_vector = vectors[index]
    similarities = cosine_similarity(item_vector, vectors).flatten()
    recommended_indices = similarities.argsort()[::-1]
    game_lists=[]
    for i in recommended_indices[1:n_recommendation]:
        game_lists.append(games.iloc[i].app_id)
    print(game_lists)
    return Response(game_lists)

# recommend('Call of Duty®: Black Ops Cold War')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_UserLibrary(request):
    user = request.user
    library = UserLibrary.objects.filter(user=user)
    if library.exists():
        serializer = UserLibrarySerializer(library, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    return Response({"error": "User's library is empty."}, status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_UserLibrary(request):
    user = request.user
    app_id = request.data.get("app_id")
    if app_id:
        # Check if this app_id is already in the user's library
        if not UserLibrary.objects.filter(user=user, app_id=app_id).exists():
            UserLibrary.objects.create(user=user, app_id=app_id)
            return Response({"message": "Game added to library."}, status=status.HTTP_201_CREATED)
        return Response({"error": "Game already in library."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "app_id is required."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_suggestions(request):
    query = request.GET.get('q', '').strip()
    if not query:
        # return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse([], safe=False)
    
    games_path = finders.find('src/final_dataset.csv') 
    games = reduce_memory(pd.read_csv(games_path, usecols=["title"])) 
    games['title'] = games['title'].astype(str)
    
    matches = pd.DataFrame(columns=["title"])
    if len(query) == 1:
        matches = games[games['title'].str[0].str.lower() == query[0].lower()]
    else:
        matches = games[games['title'].str.split().str[0].str.contains(fr'\b{query}', case=False, na=False)]
        
        if matches.empty or len(matches)<10:
            matches = games[games['title'].str.split().str[1].str.contains(fr'\b{query}', case=False, na=False)]
        
        if matches.empty or len(matches)<10:
            matches = games[games['title'].str.contains(fr'\b{query}', case=False, na=False)]
    
    suggestions = matches.head(10)["title"].tolist()
    return JsonResponse(suggestions, safe=False)