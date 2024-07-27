import numpy as np
import pandas as pd

def reduce_memory(df):
    for col in df.columns:
        if df[col].dtype == 'float64':
            df[col] = df[col].astype('float32')
        if df[col].dtype == 'int64':
            df[col] = df[col].astype('int32')
    return df

games = reduce_memory(pd.read_csv('./games.csv',usecols=["app_id","title","date_release","price_original"]))


# users = reduce_memory(pd.read_csv('./users.csv'))
# print(games.head(7))

recommendations = reduce_memory(pd.read_csv('./recommendations.csv',usecols=["app_id","hours","user_id"], ))


recommend_with_users = recommendations.merge(games,on='app_id')
# print(recommend_with_users.head(7))

no_of_ppl_played_df = recommend_with_users.groupby('app_id').count()['user_id'].reset_index()
no_of_ppl_played_df.rename(columns={'user_id':'no_of_ppl'},inplace=True)

# print(no_of_ppl_played_df.head(7))

hours_played_df = recommend_with_users.groupby('app_id')["hours"].mean().reset_index()
hours_played_df.rename(columns={'hours':'mean_hours'},inplace=True)


# print(hours_played_df.head(7))
most_played_game_df = no_of_ppl_played_df.merge(hours_played_df,on='app_id')
# print(most_played_game_df.head(30))

popular_games_df = most_played_game_df[most_played_game_df['no_of_ppl'] >= 10000].sort_values("mean_hours",ascending=False).head(50)

print(popular_games_df.merge(games,on="app_id"))

# print(recommendations.duplicated().sum())
reviewer_ppl = recommend_with_users.groupby('user_id').count()['hours']>10

print(reviewer_ppl)
print(reviewer_ppl[reviewer_ppl].index)