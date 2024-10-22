import csv
from django.core.management.base import BaseCommand
from api.models import Game, Recommendation
from datetime import datetime
from django.contrib.staticfiles import finders

class Command(BaseCommand):
    help = 'Import data from CSV files into the database'
    
    

    def handle(self, *args, **kwargs):
        # Import games.csv
        games_path = finders.find('src/games.csv')
        with open(games_path, 'r',encoding='utf-8') as games_file:
            reader = csv.DictReader(games_file)
            for row in reader:
                Game.objects.update_or_create(
                    app_id=row['app_id'],
                    defaults={
                        'title': row['title'],
                        'date_release': datetime.strptime(row['date_release'], '%m/%d/%Y'),
                        'price_original': row['price_original']
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported games.csv'))

        # Import recommendations_modified.csv
        recommendations_path = finders.find('src/recommendations.csv')
        with open(recommendations_path, 'r',encoding='utf-8') as rec_file:
            reader = csv.DictReader(rec_file)
            for row in reader:
                game = Game.objects.get(app_id=row['app_id'])
                Recommendation.objects.update_or_create(
                    app_id=game,
                    user_id=row['user_id'],
                    defaults={'hours': row['hours']}
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported recommendations_modified.csv'))