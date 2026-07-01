from repositories.history_repository import HistoryRepository
from repositories.song_repository import SongRepository


class HistoryService:
    """
    Business logic for user listening history.
    """

    @staticmethod
    def add_song(user_id, song):
        """
        Add a song to user's history.
        """

        if not user_id:
            raise ValueError("User ID is required.")

        if not song:
            raise ValueError("Song data is required.")

        if "songId" not in song:
            raise ValueError("songId is missing.")

        HistoryRepository.add_song(
            user_id,
            song
        )

        return {
            "success": True,
            "message": "Song added to history."
        }

    @staticmethod
    def get_recent(
        user_id,
        limit=20
    ):

        history = HistoryRepository.get_recent(
            user_id,
            limit
        )

        if not history:
            return []

        song_ids = [

            item["songId"]

            for item in history

        ]

        songs = SongRepository.get_songs(
            song_ids
        )
    
        songs = SongRepository.serialize_many(
            songs
        )

        song_map = {

            song["songId"]: song

            for song in songs

        }

        results = []

        for item in history:

            song = song_map.get(
                item["songId"]
            )

            if not song:
                continue

            song["playedAt"] = item["playedAt"]
    
            results.append(song)

        return results

    @staticmethod
    def remove_song(user_id, song_id):
        """
        Remove one song from history.
        """

        if not user_id:
            raise ValueError("User ID is required.")

        if not song_id:
            raise ValueError("songId is required.")

        HistoryRepository.remove_song(
            user_id,
            song_id
        )

        return {
            "success": True,
            "message": "Song removed from history."
        }

    @staticmethod
    def clear_history(user_id):
        """
        Clear complete listening history.
        """

        if not user_id:
            raise ValueError("User ID is required.")

        HistoryRepository.clear_history(user_id)

        return {
            "success": True,
            "message": "History cleared."
        }

    @staticmethod
    def get_history_count(user_id):
        """
        Number of songs in history.
        """

        if not user_id:
            return 0

        return HistoryRepository.get_history_count(
            user_id
        )

    @staticmethod
    def has_history(user_id):
        """
        Returns True if user has history.
        """

        if not user_id:
            return False

        return HistoryRepository.history_exists(
            user_id
        )