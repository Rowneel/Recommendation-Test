from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# class Game(models.Model):
#     app_id = models.IntegerField(primary_key=True)
#     title = models.CharField(max_length=255)
#     date_release = models.DateField()
#     price_original = models.FloatField()

#     def __str__(self):
#         return self.title
    
# class Recommendation(models.Model):
#     app_id = models.ForeignKey(Game, on_delete=models.CASCADE)
#     user_id = models.IntegerField()
#     hours = models.FloatField()

#     def __str__(self):
#         return f"User {self.user_id} - Game {self.app_id}"


class UserLibrary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="library")
    app_id = models.CharField(max_length=255)
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'app_id')


