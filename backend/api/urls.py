from django.contrib import admin
from django.urls import path
from . import views
from .views import CustomUserView



urlpatterns = [
    path('popular_games',views.getPopularGames),
    # path('login',views.login),
    
    path('register',views.register,name="register"),
    # path('test',views.test,name="test"),
    path('app_details/<str:app_id>',views.app_details_view,name="app_details"),
    path('recommendation_description/<str:game>',views.recommendation_by_description,name='recommendation_description'),
    path('get_UserLibrary',views.get_UserLibrary,name="get_UserLibrary"),
    path('post_UserLibrary',views.post_UserLibrary,name="post_UserLibrary"),
    path('autosuggest_api/',views.api_suggestions,name="autosuggest_api"),
    path('recommendation_title/<str:title>',views.recommendation_by_title,name='recommendation_title'),
    path('user',CustomUserView.as_view(),name="user"),
    path('update_avatar',views.update_avatar,name="update_avatar"),
    path('update_user',views.update_user,name="update_user"),
    path('remove_UserLibrary',views.remove_UserLibrary,name="remove_UserLibrary")
    

    # path('logout',views.logout),

]