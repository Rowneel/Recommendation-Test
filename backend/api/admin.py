from django.contrib import admin
from api.models import UserLibrary,User,CustomUser

# Register your models here.
admin.site.register(UserLibrary)
admin.site.register(CustomUser)