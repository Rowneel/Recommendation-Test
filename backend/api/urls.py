from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path('',views.getData),
    # path('login',views.login),
    
    path('register',views.register,name="register"),
    path('test',views.test,name="test"),

    # path('logout',views.logout),

    
]
