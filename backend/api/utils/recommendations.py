import numpy as np
import pandas as pd
import pickle
import re
import json
from django.contrib.staticfiles import finders
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from django.core.cache import cache

def reduce_memory(df):
    for col in df.columns:
        if df[col].dtype == 'float64':
            df[col] = df[col].astype('float32')
        if df[col].dtype == 'int64':
            df[col] = df[col].astype('int32')
    return df


def preprocess_title(file_path):
    games_path = finders.find(file_path)
    games = reduce_memory(pd.read_csv(games_path))
    for i, row in games.iterrows():
        clean = re.sub('[^A-Za-z0-9]+', ' ', row["title"]).lower()
        clean = clean.lower()
        games.at[i, 'clean_title'] = clean
    return games


def calculate_similarity(games):
    count = TfidfVectorizer(stop_words='english')
    count_matrixx = count.fit_transform(games["clean_title"])
    cosine_sim_matrix = cosine_similarity(count_matrixx, dense_output=False)
    return cosine_sim_matrix

def save_matrix(matrix, file_path):
    with open(file_path, 'wb') as f:
        pickle.dump(matrix, f)

def load_matrix(file_path):
    matrix_path = finders.find(file_path)
    with open(matrix_path, 'rb') as f:
        return pickle.load(f)

def get_recommendations(title, games, cosine_sim, n_recommendation=20):
    try:
        index = games[games['title'] == title].index[0]
        similarity_array = cosine_sim[index].toarray().flatten()
        sim_scores = sorted(list(enumerate(similarity_array)), key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:n_recommendation + 1]
        game_indices = [i[0] for i in sim_scores]
        return games['app_id'].iloc[game_indices].tolist()
    except IndexError:
        return []
    


def get_vectors_from_cache():
    vectors = cache.get('vectors_final')
    if vectors is None:
        vectors_final_pickle_path = finders.find('src/vectors_final.pkl')
        vectors=pickle.load(open(vectors_final_pickle_path,'rb'))
        cache.set('vectors_final', vectors, timeout=3600)  # Cache for 1 hour
    return vectors


