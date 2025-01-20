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
from .utils.recommendations import preprocess_title, load_matrix, get_recommendations,reduce_memory,get_vectors_from_cache,get_personalized_recommendations,get_vector_for_personalized_recommendation,recommendation_by_desc, preprocess_text, get_tfidf_vectorizer_from_cache
from rest_framework import status
# from api.models import Game,Recommendation
from api.models import UserLibrary,CustomUser
from api.serializers import UserLibrarySerializer,CustomUserDetailsSerializer
from dj_rest_auth.views import UserDetailsView
# from api.serializers import GameSerializer,RecommendationSerializer
import numpy as np
import pandas as pd
from django.contrib.auth.models import User,auth
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
import re


#Authentication and Registration
@api_view(['POST'])
def register(request):
    username = request.data.get('username', "")
    email = request.data.get('email', "")
    password = request.data.get('password', "")
    first_name = request.data.get('first_name', "")
    last_name = request.data.get('last_name', "")
    avatar = request.FILES.get('avatar', None) 

    if CustomUser.objects.filter(username=username).exists():
        return Response({"error": "The username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if not username or not email or not password:
        return Response({"error": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    # if not avatar:
    #     return Response({"error": "Please upload an avatar."}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "The email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.create_user(username=username, email=email, password=password,first_name = first_name, last_name= last_name,avatar=avatar)
        user.save()
        response =  Response({"message": "User created successfully"})
        print(response.data)
        return response
    except IntegrityError:
        return Response({"error": "Failed to create user. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    
    

class CustomUserView(UserDetailsView):
    # Use your custom serializer here
    serializer_class = CustomUserDetailsSerializer
    
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_avatar(request):
    user = request.user
    avatar = request.FILES.get('avatar', None)
    
    if avatar:
        user.avatar = avatar
        user.save()
        return Response({"message": "Avatar updated successfully"}, status=status.HTTP_200_OK)
    return Response({"error": "Please upload an avatar."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    username = request.data.get('username', "")
    first_name = request.data.get('first_name', "")
    last_name = request.data.get('last_name', "")
    if not username:
        return Response({"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)
    if CustomUser.objects.exclude(pk=user.pk).filter(username=username).exists():
        return Response({"error": "The username already exists."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return Response({"message": "User details updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
#Recommendations
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
    popular_games_df = most_played_game_df[most_played_game_df['no_of_ppl'] >= 1000].sort_values("mean_hours",ascending=False).head(10) 
    
    
    #merging the popular_games_df with the games data to get the titles of the games
    top_games_df = popular_games_df.merge(games,on="app_id")
    games_list = top_games_df['app_id'].values
    #DataFrame to Dictionary conversion to get every game as dectionary
    # games_list = top_games_df.to_dict(orient='records')
    return Response(games_list)



@api_view(['GET'])
def recommendation_by_description(request,game,n_recommendation = 20):
    games_path = finders.find('src/final_dataset.csv') 
    games = reduce_memory(pd.read_csv(games_path))
    
    # similarity = get_similarity_from_cache()
    try:
        vectors = get_vectors_from_cache()
        # Check if the input matches a game title
        if game in games['title'].values:
            index = games[games['title'] == game].index[0]
            item_vector = vectors[index]
        else:
            # Preprocess the input text
            processed_text = preprocess_text(game)
            tfidfV = get_tfidf_vectorizer_from_cache()

            # Treat processed input as a description and transform it to a vector
            input_vector = tfidfV.transform([processed_text])
            item_vector = input_vector.toarray()  #
        similarities = cosine_similarity(item_vector, vectors).flatten()
        recommended_indices = similarities.argsort()[::-1]
        game_lists=[]
        for i in recommended_indices[1:n_recommendation]:
            game_lists.append(games.iloc[i].app_id)
        print(game_lists)
        return Response(game_lists)
    except IndexError:
         return JsonResponse({'error': 'Cannot find the game specified'}, status=400)


@api_view(['GET'])
def recommendation_by_title(request,title):
    games = preprocess_title('src/games_preprocessed_with_tags_porterstemmer.csv')
    cosine_sim = load_matrix('src/vectors_for_title.pkl')
    # title = request.GET.get('title')  # Get title from query params
    if not title:
        return JsonResponse({'error': 'No title provided'}, status=400)
    
    recommendations = get_recommendations(title, games, cosine_sim)
    # return JsonResponse({'recommendations': recommendations})
    return Response(recommendations)


@api_view(['GET'])
def personalized_recommendation(request):
    user = request.user
    library = UserLibrary.objects.filter(user=user)
    games_path = finders.find('src/final_dataset.csv') 
    games = reduce_memory(pd.read_csv(games_path))
    games['app_id'] = games['app_id'].astype(str)
    recommendations_ids= []
    if library.exists():
        game_ids = list(library.values_list('app_id',flat=True))
        print(game_ids)
        for i in game_ids:
            game_title_array = games.loc[games['app_id'] == i, 'title'].values
            game_title = game_title_array[0]  # Extract the title as a string
            recommendations = recommendation_by_desc(game_title,5)
            for j in recommendations:
                recommendations_ids.append(j)
        print(recommendations_ids)
        print(type(recommendations_ids[0]))
        if not game_ids:
            return JsonResponse({'error': 'No games in library'}, status=400)
    return Response(recommendations_ids)

@api_view(['GET'])
def get_game_recommendations(request,game_name):
    n=10
    game_similarity_df = pd.read_pickle(finders.find('src/game_similarity_df.pkl'))
    mapped_df = pd.read_pickle(finders.find('src/mapped_df.pkl'))
    # Check if the game name exists in the filtered_df_player_count
    if game_name not in mapped_df['title'].values:
        # return Response({"error": "The game lacks rating. Unable to find recommendations."}, status=status.HTTP_400_BAD_REQUEST)
        recommendations = recommendation_by_desc(game_name,20)
        return Response(recommendations)

    
    # Get the app_id of the input game
    app_id = mapped_df.loc[mapped_df['title'] == game_name, 'app_id'].values[0]
    
    # Check if the app_id is in the similarity matrix
    if app_id not in game_similarity_df.index:
        return Response({"error": "No similar games found/ Low rated game "}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get similarity scores for the game and sort them in descending order
    similarity_scores = game_similarity_df.loc[app_id].sort_values(ascending=False)
    
    # Get top n similar app_ids (excluding the game itself)
    top_app_ids = similarity_scores.iloc[1:n+1].index  # Exclude the first as it's the game itself
    
    # Map app_ids to game titles
    recommendations = mapped_df[mapped_df['app_id'].isin(top_app_ids)]['app_id'].tolist()
    
    return Response(recommendations)

# print(get_game_recommendations('Dota 2', 5, game_similarity_df, mapped_df))
# # Output: ['Game B', 'Game C']

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
    
#User Library
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_UserLibrary(request):
    user = request.user
    library = UserLibrary.objects.filter(user=user)
    if library.exists():
        serializer = UserLibrarySerializer(library, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    return Response({"error": "User's library is empty."}, status=status.HTTP_404_NOT_FOUND)


# add to user library list
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_UserLibrary(request):
    user = request.user
    app_ids = request.data.get("app_id",[])
    if not isinstance(app_ids,list):
        app_ids = [app_ids]
    if not app_ids:
        return Response({"error": "List of app IDs required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        existing_app_ids = UserLibrary.objects.filter(user=user,app_id__in=app_ids).values_list("app_id",flat=True)
        new_app_ids = [app_id for app_id in app_ids if app_id not in existing_app_ids]
        if new_app_ids:
            # for app_id in new_app_ids:
            #     UserLibrary.objects.create(user=user,app_id=app_id)
            UserLibrary.objects.bulk_create([UserLibrary(user=user,app_id=app_id) for app_id in new_app_ids])
            return Response({"message": f"{len(new_app_ids)} game(s) added to library.", "added_app_ids": new_app_ids},status=status.HTTP_201_CREATED)
        return Response({"error":"All games are already in the library"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_UserLibrary(request):
    user = request.user
    app_id = request.data.get("app_id")
    if not app_id:
        return Response({"error": "app_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        game = UserLibrary.objects.filter(user=user, app_id=app_id).first()
        if game:
            game.delete()
            return Response({"message": "Game removed from library."}, status=status.HTTP_200_OK)
        return Response({"error": "Game is not in the library."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#auto suggest api
@api_view(['GET'])
def api_suggestions(request):
    query = request.GET.get('q', '').strip()
    if not query:
        # return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse([], safe=False)
    
    games_path = finders.find('src/final_dataset.csv') 
    games = reduce_memory(pd.read_csv(games_path, usecols=["app_id","title"])) 
    games['title'] = games['title'].astype(str)
    
    matches = pd.DataFrame(columns=["app_id","title"])
    if len(query) == 1:
        matches = games[games['title'].str[0].str.lower() == query[0].lower()]
    else:
        matches = games[games['title'].str.split().str[0].str.contains(fr'\b{query}', case=False, na=False)]
        
        if matches.empty or len(matches)<10:
            matches = games[games['title'].str.split().str[1].str.contains(fr'\b{query}', case=False, na=False)]
        
        if matches.empty or len(matches)<10:
            matches = games[games['title'].str.contains(fr'\b{query}', case=False, na=False)]
    
    suggestions = matches.head(10)[["app_id","title"]].to_dict(orient="records")
    return JsonResponse(suggestions, safe=False)

        
    
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



# @api_view(['GET'])
# def logout(request):
#     auth.logout(request)
#     return Response({"message": "User logged out successfully"})



# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def test(request):
#     return Response({"message": "You are authenticated"})


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


# def reduce_memory(df):
#     for col in df.columns:
#         if df[col].dtype == 'float64':
#             df[col] = df[col].astype('float32')
#         if df[col].dtype == 'int64':
#             df[col] = df[col].astype('int32')
#     return df


# def get_similarity_from_cache():
#     similarity = cache.get('similarity_matrix')
#     if similarity is None:
#         similarity_pickle_path = finders.find('src/similarity_forDesc.pkl')
#         similarity=pickle.load(open(similarity_pickle_path,'rb'))
#         cache.set('similarity_matrix', similarity, timeout=3600)  # Cache for 1 hour
#     return similarity

