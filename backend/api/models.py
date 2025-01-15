from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import os
from PIL import Image

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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="library")
    app_id = models.CharField(max_length=255)
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'app_id')
        verbose_name = 'User Library' 
        verbose_name_plural = 'User Libraries'
        
def avatar_upload_to(instance, filename):
    ext = filename.split('.')[-1]  # Get the file extension
    filename = f"{instance.username}_avatar.{ext}"  # Format the filename
    return os.path.join('avatars/', filename)  # Store the file in 'avatars/' directory
        
class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to=avatar_upload_to , null=True, blank=True)
    class Meta:
        verbose_name = 'Custom User' 
        verbose_name_plural = 'Custom Users'
    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.avatar:
            avatar_path = self.avatar.path
            try:
                with Image.open(avatar_path) as img:
        
                    img = img.convert("RGB")  
                    # img.thumbnail((640, 640))  
                    width, height = img.size
                    new_size = min(width, height)
                    left = (width - new_size) / 2
                    top = (height - new_size) / 2
                    right = (width + new_size) / 2
                    bottom = (height + new_size) / 2
                    img = img.crop((left, top, right, bottom))  
                    img = img.resize((640, 640)) 
                    img.save(avatar_path, format='JPEG', quality=100) 
            except Exception as e:
                print(f"Error processing avatar: {e}")
