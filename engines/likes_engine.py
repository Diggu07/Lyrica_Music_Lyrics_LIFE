from collections import Counter

from repositories.likes_repository import LikesRepository
from repositories.song_repository import SongRepository


class LikesEngine:
    """
    Builds a preference profile from a user's liked songs.

    Responsibilities
    ----------------
    - Analyze liked songs
    - Calculate artist affinity
    - Calculate genre affinity
    - Track liked songs

    DOES NOT generate recommendations.
    """

    @staticmethod
    def build_profile(user_id):

        # ------------------------------------------
        # Get liked songs
        # ------------------------------------------

        liked = LikesRepository.get_liked_songs(user_id)

        if not liked:
            return {
                "likedSongIds": [],
                "artistWeights": {},
                "genreWeights": {}
            }

        # ------------------------------------------
        # Extract unique song ids
        # ------------------------------------------

        song_ids = list({
            item.get("songId")
            for item in liked
            if item.get("songId")
        })

        # ------------------------------------------
        # Fetch all songs in ONE query
        # ------------------------------------------

        songs = SongRepository.get_songs(song_ids)

        # ------------------------------------------
        # Lookup table
        # ------------------------------------------

        song_lookup = {
            song["songId"]: song
            for song in songs
        }

        # ------------------------------------------
        # Preference profile
        # ------------------------------------------

        artist_weights = Counter()
        genre_weights = Counter()

        liked_song_ids = []

        for item in liked:

            song_id = item.get("songId")

            if not song_id:
                continue

            liked_song_ids.append(song_id)

            song = song_lookup.get(song_id)

            if not song:
                continue

            # Likes are stronger than history
            for artist_id in song.get("artistIds", []):
                artist_weights[artist_id] += 3

            for genre in song.get("genres", []):
                genre_weights[genre] += 3

        return {
            "likedSongIds": liked_song_ids,
            "artistWeights": dict(artist_weights),
            "genreWeights": dict(genre_weights)
        }