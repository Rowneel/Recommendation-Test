from rest_framework import serializers
from django.contrib.auth.models import User
# # from .models import Game,Recommendation
from .models import UserLibrary

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']
        
class UserLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLibrary
        fields = ['app_id', 'added_at']