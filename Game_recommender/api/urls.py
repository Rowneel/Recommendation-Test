from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path('',views.getData),
    # path('login',views.login),
    
    path('register',views.register),

    # path('logout',views.logout),

    
]
