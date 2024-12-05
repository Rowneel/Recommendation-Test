from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth.models import User
# # from .models import Game,Recommendation
from .models import UserLibrary,CustomUser
import os

# # class GameSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Game
# #         fields = ['app_id', 'title', 'date_release', 'price_original']
        
# # class RecommendationSerializer(serializers.ModelSerializer):
# #     # Include the related Game info using GameSerializer
# #     app_id = GameSerializer()

# #     class Meta:
# #         model = Recommendation
# #         fields = ['app_id', 'user_id', 'hours']


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username', 'password', 'first_name', 'last_name', 'email']
        
class UserLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLibrary
        fields = ['app_id', 'added_at']
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','avatar','username', 'password', 'first_name', 'last_name', 'email']
        

class CustomUserDetailsSerializer(UserDetailsSerializer):
    # avatar = serializers.ImageField(source='avatar.url', read_only=True)
    avatar = serializers.SerializerMethodField()
    class Meta(UserDetailsSerializer.Meta):
        model = CustomUser
        fields = UserDetailsSerializer.Meta.fields + ('avatar',)
    def get_avatar(self, obj):
        if obj.avatar:
            # print(f"Avatar URL: {obj.avatar.url}")  # Debugging
            return obj.avatar.url
        # print("cannot find avatar")
        return os.path.join("avatars/","default_avatar.png")