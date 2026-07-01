from providers.dto.song_dto import SongDTO
from schemas.song_schema import SongSchema


class ChartNormalizer:

    # =====================================================
    # Matched Song
    # =====================================================

    @staticmethod
    def matched(
        song,
        rank: int
    ):
        """
        Normalize a matched Lyrica song.

        Accepts:
            SongDTO
            SongSchema
            dict
        """

        # -----------------------------
        # SongSchema
        # -----------------------------
        if isinstance(song, SongSchema):

            track = song.model_dump(
                exclude_none=True
            )

        # -----------------------------
        # SongDTO
        # -----------------------------
        elif isinstance(song, SongDTO):

            track = {

                "provider": song.provider,

                "providerId": song.provider_id,

                "title": song.title,

                "artists": song.artists,

                "album": song.album,

                "cover": song.cover,

                "thumbnail": song.thumbnail,

                "duration": song.duration,

                "durationSecs": song.durationSecs,

                "language": song.language,

                "genres": song.genres,

                "playable": song.playable,

                "explicit": song.explicit,

                "popularity": song.popularity,

                "releaseDate": song.releaseDate,

                "year": song.year,

                "lyricsAvailable": song.lyrics_available

            }

        # -----------------------------
        # Legacy dict
        # -----------------------------
        else:

            track = dict(song)

        track["rank"] = rank

        track["playable"] = True

        return track

    # =====================================================
    # Apple Only
    # =====================================================

    @staticmethod
    def unmatched(
        apple_track,
        metadata,
        rank
    ):

        apple_id = str(

            apple_track.get(

                "id",

                apple_track.get(

                    "apple_id",

                    ""

                )

            )

        )

        cover = apple_track.get(

            "artworkUrl100",

            apple_track.get(

                "cover",

                ""

            )

        )

        if cover:

            cover = cover.replace(

                "100x100bb.jpg",

                "500x500bb.jpg"

            )

        return {

            "rank": rank,

            "provider": "apple",

            "providerId": apple_id,

            "title": apple_track.get(

                "name",

                apple_track.get(

                    "title",

                    ""

                )

            ),

            "artist": apple_track.get(

                "artistName",

                apple_track.get(

                    "artist",

                    ""

                )

            ),

            "cover": cover,

            "album": metadata.get(

                "album",

                ""

            ),

            "duration": metadata.get(

                "duration",

                "0:00"

            ),

            "durationSecs": metadata.get(

                "duration_secs",

                0

            ),

            "playable": False

        }

    # =====================================================
    # Overview
    # =====================================================

    @staticmethod
    def overview(
        chart,
        cover,
        track_count
    ):

        title = chart["title"]

        if "50" in title:

            title = title.replace(

                "50",

                str(track_count)

            )

        return {

            "type": chart["type"],

            "language": chart["language"],

            "title": title,

            "description": chart["desc"],

            "ratio": chart["ratio"],

            "cover": cover,

            "trackCount": track_count

        }

    # =====================================================
    # Placeholder
    # =====================================================

    @staticmethod
    def placeholder(
        chart,
        cover
    ):

        return {

            "type": chart["type"],

            "language": chart["language"],

            "title": chart["title"],

            "description": chart["desc"],

            "ratio": chart["ratio"],

            "cover": cover,

            "trackCount": 50

        }

    # =====================================================
    # Detail
    # =====================================================

    @staticmethod
    def detail(
        tracks,
        source
    ):

        return {

            "tracks": tracks,

            "source": source

        }