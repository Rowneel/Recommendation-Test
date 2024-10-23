from django.db import models

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


