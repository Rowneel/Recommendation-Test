from rest_framework import serializers
from .models import Game,Recommendation

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['app_id', 'title', 'date_release', 'price_original']
        
class RecommendationSerializer(serializers.ModelSerializer):
    # Include the related Game info using GameSerializer
    app_id = GameSerializer()

    class Meta:
        model = Recommendation
        fields = ['app_id', 'user_id', 'hours']