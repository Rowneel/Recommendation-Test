from django.core.management.base import BaseCommand
from api.utils.recommendations import preprocess_title, calculate_similarity, save_matrix
from django.contrib.staticfiles import finders

class Command(BaseCommand):
    help = "Precomputes the cosine similarity matrix"

    def handle(self, *args, **kwargs):
        # Load and preprocess data
        # games_path = finders.find('src/games_preprocessed_with_tags_porterstemmer.csv')
        games = preprocess_title('src/games_preprocessed_with_tags_porterstemmer.csv')
        
        # Calculate the cosine similarity matrix
        cosine_sim = calculate_similarity(games)
        
        # Save the matrix
        save_matrix(cosine_sim, 'static/src/vectors_for_title.pkl')
        
        self.stdout.write(self.style.SUCCESS('Cosine similarity matrix computed and saved!'))