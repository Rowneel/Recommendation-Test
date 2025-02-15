# Generated by Django 5.1.2 on 2024-12-05 17:03

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_customuser_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avatar',
            field=models.ImageField(blank=True, default='default_avatar.png', upload_to=api.models.avatar_upload_to),
            preserve_default=False,
        ),
    ]
