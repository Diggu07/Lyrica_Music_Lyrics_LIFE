from collections import Counter

from repositories.history_repository import HistoryRepository
from repositories.song_repository import SongRepository


class HistoryEngine:
    """
    Builds a listening profile from a user's listening history.

    Responsibilities
    ----------------
    - Analyze listening history
    - Calculate artist preferences
    - Calculate genre preferences
    - Track listened songs

    DOES NOT generate recommendations.
    """

    @staticmethod
    def build_profile(user_id):

        # ------------------------------------------
        # Get recent listening history
        # ------------------------------------------

        history = HistoryRepository.get_recent_history(user_id)

        if not history:
            return {
                "history": [],
                "listenedSongIds": [],
                "artistWeights": {},
                "genreWeights": {}
            }

        # ------------------------------------------
        # Collect unique song ids
        # ------------------------------------------

        song_ids = list({
            item.get("songId")
            for item in history
            if item.get("songId")
        })

        # ------------------------------------------
        # Fetch all songs in ONE database query
        # ------------------------------------------

        songs = SongRepository.get_songs(song_ids)

        # ------------------------------------------
        # Build lookup table
        # ------------------------------------------

        song_lookup = {
            song["songId"]: song
            for song in songs
        }

        # ------------------------------------------
        # Build preference profile
        # ------------------------------------------

        artist_weights = Counter()
        genre_weights = Counter()

        listened_song_ids = []

        for item in history:

            song_id = item.get("songId")

            if not song_id:
                continue

            listened_song_ids.append(song_id)

            song = song_lookup.get(song_id)

            if not song:
                continue

            # Multiple artists per song
            for artist_id in song.get("artistIds", []):
                artist_weights[artist_id] += 1

            # Multiple genres per song
            for genre in song.get("genres", []):
                genre_weights[genre] += 1

        # ------------------------------------------
        # Return profile
        # ------------------------------------------

        return {
            "history": history,
            "listenedSongIds": listened_song_ids,
            "artistWeights": dict(artist_weights),
            "genreWeights": dict(genre_weights)
        }