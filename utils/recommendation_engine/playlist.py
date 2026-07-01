from collections import Counter

from repositories.recommendation_repository import (
    RecommendationRepository
)


class PlaylistEngine:
    """
    Playlist based recommendations.
    """

    @staticmethod
    def recommend_from_song(
        song_id,
        limit=20
    ):

        playlists = RecommendationRepository.get_playlists_containing_song(
            song_id
        )

        counter = Counter()

        for playlist in playlists:

            for song in playlist.get("songs", []):

                sid = song.get("songId")

                if sid and sid != song_id:
                    counter[sid] += 1

        top_ids = [
            song_id
            for song_id, _
            in counter.most_common(limit)
        ]

        return RecommendationRepository.get_songs(
            top_ids
        )

    @staticmethod
    def recommend_from_user(
        user_id
    ):

        playlists = RecommendationRepository.get_user_playlists(
            user_id
        )

        songs = []

        seen = set()

        for playlist in playlists:

            for song in playlist.get("songs", []):

                sid = song.get("songId")

                if sid in seen:
                    continue

                seen.add(sid)

                songs.append(sid)

        return RecommendationRepository.get_songs(
            songs
        )