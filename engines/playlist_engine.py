from repositories.playlist_repository import PlaylistRepository
from repositories.song_repository import SongRepository


class PlaylistEngine:
    """
    Generates recommendation candidates
    from the user's playlists.

    Responsibilities
    ----------------
    - Read playlists
    - Extract song ids
    - Return candidate SongSchemas

    DOES NOT:
    - Rank songs
    - Remove duplicates
    - Filter history
    """

    # ==========================================================
    # From User Playlists
    # ==========================================================

    @staticmethod
    def from_user(
        user_id,
        limit=100
    ):

        playlists = PlaylistRepository.get_user_playlists(
            user_id
        )

        if not playlists:
            return []

        song_ids = set()

        for playlist in playlists:

            for song in playlist.get(
                "songs",
                []
            ):

                song_id = song.get(
                    "songId"
                )

                if song_id:
                    song_ids.add(song_id)

        if not song_ids:
            return []

        songs = SongRepository.get_songs(
            list(song_ids)
        )

        return songs[:limit]