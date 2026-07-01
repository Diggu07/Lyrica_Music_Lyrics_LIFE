import random


class DiversityEngine:
    """
    Removes repetitive recommendations and
    introduces variety into the final result.
    """

    MAX_ARTIST_SONGS = 3
    MAX_ALBUM_SONGS = 2

    # ==========================================================
    # Remove Duplicate Songs
    # ==========================================================

    @staticmethod
    def remove_duplicates(songs):

        unique = []
        seen = set()

        for song in songs:

            if not song:
                continue

            song_id = song.get("songId")

            if not song_id:
                continue

            if song_id in seen:
                continue

            seen.add(song_id)
            unique.append(song)

        return unique

    # ==========================================================
    # Limit Songs Per Artist
    # ==========================================================

    @staticmethod
    def limit_artist_repetition(songs):

        result = []
        artist_counter = {}

        for song in songs:

            artist = song.get("artistId")

            if not artist:
                result.append(song)
                continue

            count = artist_counter.get(artist, 0)

            if count >= DiversityEngine.MAX_ARTIST_SONGS:
                continue

            artist_counter[artist] = count + 1
            result.append(song)

        return result

    # ==========================================================
    # Limit Songs Per Album
    # ==========================================================

    @staticmethod
    def limit_album_repetition(songs):

        result = []
        album_counter = {}

        for song in songs:

            album = song.get("albumId")

            if not album:
                result.append(song)
                continue

            count = album_counter.get(album, 0)

            if count >= DiversityEngine.MAX_ALBUM_SONGS:
                continue

            album_counter[album] = count + 1
            result.append(song)

        return result

    # ==========================================================
    # Shuffle Slightly
    # ==========================================================

    @staticmethod
    def soft_shuffle(songs):

        songs = list(songs)

        if len(songs) <= 3:
            return songs

        first = songs[:3]
        remaining = songs[3:]

        random.shuffle(remaining)

        return first + remaining

    # ==========================================================
    # Inject Discovery Songs
    # ==========================================================

    @staticmethod
    def inject_discovery(
        recommendations,
        discovery,
        count=3
    ):

        existing = {
            song["songId"]
            for song in recommendations
        }

        added = 0

        for song in discovery:

            if added >= count:
                break

            if song["songId"] in existing:
                continue

            recommendations.append(song)

            existing.add(song["songId"])

            added += 1

        return recommendations

    # ==========================================================
    # Final Pipeline
    # ==========================================================

    @staticmethod
    def diversify(
        songs,
        discovery=None
    ):

        songs = DiversityEngine.remove_duplicates(
            songs
        )

        songs = DiversityEngine.limit_artist_repetition(
            songs
        )

        songs = DiversityEngine.limit_album_repetition(
            songs
        )

        if discovery:

            songs = DiversityEngine.inject_discovery(
                songs,
                discovery
            )

        songs = DiversityEngine.soft_shuffle(
            songs
        )

        return songs
    