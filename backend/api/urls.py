from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path('',views.getData),
    # path('login',views.login),
    
    path('register',views.register,name="register"),
    path('test',views.test,name="test"),
    path('app_details/<str:app_id>',views.app_details_view,name="app_details"),
    path('recommendation_description/<str:game>',views.recommendation_by_description,name='recommendation_description'),

    # path('logout',views.logout),

    
]
