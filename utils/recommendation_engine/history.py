from collections import Counter

from repositories.recommendation_repository import (
    RecommendationRepository
)


class HistoryEngine:
    """
    Generates recommendation signals from
    user's listening history.
    """

    @staticmethod
    def get_recent_history(user_id, limit=100):
        """
        Returns recent listening activity.
        """
        return RecommendationRepository.get_user_history(
            user_id,
            limit
        )

    @staticmethod
    def get_recent_song_ids(user_id, limit=100):

        history = HistoryEngine.get_recent_history(
            user_id,
            limit
        )

        return [
            activity["songId"]
            for activity in history
            if "songId" in activity
        ]

    @staticmethod
    def get_most_played_song_ids(
        user_id,
        limit=20
    ):

        songs = RecommendationRepository.get_most_played(
            user_id,
            limit
        )

        return [
            song["_id"]
            for song in songs
        ]

    @staticmethod
    def get_favorite_artists(
        user_id,
        limit=10
    ):
    
        history = HistoryEngine.get_recent_history(
            user_id,
            500
        )
    
        song_ids = [
            activity["songId"]
            for activity in history
            if "songId" in activity
        ]
    
        songs = RecommendationRepository.get_songs(
            song_ids
        )
    
        artist_counter = Counter()
    
        for song in songs:
        
            artist = song.get("artistId")
    
            if artist:
                artist_counter[artist] += 1
    
        return [
            artist
            for artist, _
            in artist_counter.most_common(limit)
        ]

    @staticmethod
    def get_favorite_genres(
        user_id,
        limit=5
    ):

        history = HistoryEngine.get_recent_history(
            user_id,
            500
        )

        song_ids = [
            activity["songId"]
            for activity in history
            if "songId" in activity
        ]

        songs = RecommendationRepository.get_songs(
            song_ids
        )

        genre_counter = Counter()

        for song in songs:

            genre = song.get("genre")

            if genre:
                genre_counter[genre] += 1

        return [
            genre
            for genre, _
            in genre_counter.most_common(limit)
        ]

    @staticmethod
    def build_history_profile(user_id):

        return {

            "recentSongs":
                HistoryEngine.get_recent_song_ids(
                    user_id
                ),

            "mostPlayed":
                HistoryEngine.get_most_played_song_ids(
                    user_id
                ),

            "favoriteArtists":
                HistoryEngine.get_favorite_artists(
                    user_id
                ),

            "favoriteGenres":
                HistoryEngine.get_favorite_genres(
                    user_id
                )
        }