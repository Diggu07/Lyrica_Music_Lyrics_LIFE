import threading

from repositories.chart_repository import ChartRepository
from providers.metadata.apple_provider import AppleProvider
from providers.playback.jiosaavn_provider import JioSaavnProvider
from services.metadata_service import MetadataService
from normalizers.chart_normalizer import ChartNormalizer
from config.language_config import LanguageConfig
from normalizers.metadata_normalizer import MetadataNormalizer
from repositories.song_repository import SongRepository


class ChartService:

    DEFAULT_INDIA_PLAYLIST = "1134548194"

    PLACEHOLDER_COVERS = {
        "worldwide": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
        "asia": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600",
        "india": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600",
        "language": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600",
    }

    @staticmethod
    def refresh_async(chart_type, language=None):

        thread = threading.Thread(
            target=ChartService.refresh_chart,
            args=(chart_type, language),
            daemon=True
        )

        thread.start()

    @staticmethod
    def refresh_chart(chart_type, language=None):

        if chart_type == "worldwide":
            return ChartService.refresh_worldwide()

        if chart_type == "asia":
            return ChartService.refresh_asia()

        return ChartService.refresh_playlist_chart(
            chart_type,
            language
        )

    @staticmethod
    def refresh_playlist_chart(chart_type, language=None):

        source = "jiosaavn"

        if chart_type == "india":

            playlist_id = (
                LanguageConfig.get("india")
                or ChartService.DEFAULT_INDIA_PLAYLIST
            )

        else:

            playlist_id = LanguageConfig.get(language)

        if not playlist_id:

            print(
                f"[ChartService] No playlist configured for {language}"
            )

            return []

        # --------------------------------------------------
        # Provider -> SongDTO
        # --------------------------------------------------

        songs = JioSaavnProvider.get_playlist_tracks(
            playlist_id
        )

        tracks = []

        for rank, dto in enumerate(songs, 1):

            # SongDTO -> SongSchema
            schema = MetadataNormalizer.normalize_song(dto)

            # Save canonical song
            SongRepository.save(schema)

            # SongSchema -> dict
            track = schema.model_dump(
                exclude_none=True
            )

            track["rank"] = rank
            track["playable"] = True

            tracks.append(track)

        ChartRepository.save_chart(

            chart_type=chart_type,

            language=language,

            source=source,

            tracks=tracks

        )

        print(

            f"[ChartService] Saved {len(tracks)} playlist tracks."

        )

        return tracks

    @staticmethod
    def refresh_worldwide():

        print("[ChartService] Refreshing Worldwide Chart")

        source = "apple"

        apple_tracks = AppleProvider.get_worldwide()

        if not apple_tracks:
            return []

        apple_ids = [
            track.get("id")
            for track in apple_tracks
            if track.get("id")
        ]

        apple_metadata = AppleProvider.lookup_tracks(
            apple_ids
        )

        tracks = []

        for rank, apple_track in enumerate(
            apple_tracks,
            1
        ):

            title = apple_track.get("name", "")
            artist = apple_track.get("artistName", "")

            matched = MetadataService.match_apple_track(
                title,
                artist
            )

            if matched:

                tracks.append(
                    ChartNormalizer.matched(
                        matched,
                        rank
                    )
                )

                continue

            apple_id = str(
                apple_track.get("id", "")
            )

            metadata = apple_metadata.get(
                apple_id,
                {}
            )

            tracks.append(

                ChartNormalizer.unmatched(
                    apple_track,
                    metadata,
                    rank
                )

            )

        ChartRepository.save_chart(

            chart_type="worldwide",

            language=None,

            source=source,

            tracks=tracks

        )

        print(

            f"[ChartService] Worldwide chart refreshed ({len(tracks)} tracks)"

        )

        return tracks
    
    @staticmethod
    def refresh_asia():

        print("[ChartService] Refreshing Asia Chart")

        source = "apple"

        apple_tracks = AppleProvider.get_asia()

        if not apple_tracks:
            return []

        apple_ids = [
            str(track.get("apple_id"))
            for track in apple_tracks
            if track.get("apple_id")
        ]

        apple_metadata = AppleProvider.lookup_tracks(
            apple_ids
        )

        tracks = []

        for rank, apple_track in enumerate(
            apple_tracks,
            1
        ):

            title = apple_track.get("title", "")
            artist = apple_track.get("artist", "")

            matched = MetadataService.match_apple_track(
                title,
                artist
            )

            if matched:

                tracks.append(
                    ChartNormalizer.matched(
                        matched,
                        rank
                    )
                )

                continue

            apple_id = str(
                apple_track.get("apple_id", "")
            )

            metadata = apple_metadata.get(
                apple_id,
                {}
            )

            tracks.append(

                ChartNormalizer.unmatched(
                    apple_track,
                    metadata,
                    rank
                )

            )

        ChartRepository.save_chart(

            chart_type="asia",

            language=None,

            source=source,

            tracks=tracks

        )

        print(

            f"[ChartService] Asia chart refreshed ({len(tracks)} tracks)"

        )

        return tracks
    
    @staticmethod
    def get_chart(
        chart_type="worldwide",
        language=None,
        region=None,
        refresh=False,
        overview=False
    ):
        chart_type = (chart_type or "worldwide").lower()

        language = (
            language.lower()
            if language
            else None
    )   

        region = (
            region.lower()
            if region
            else None
    )   

        if region:

                chart_type = (
                "worldwide"
                if region == "globe"
                else region
            )
            
        VALID_TYPES = {
            "worldwide",
            "asia",
            "india",
            "language"
        }

        if chart_type not in VALID_TYPES:
            raise ValueError("Invalid chart type.")

        if chart_type == "language" and not language:
            raise ValueError(
                "language is required for language charts."
            )
        if overview:

            charts_to_load = [

                {
                    "type": "worldwide",
                    "language": None,
                    "title": "Worldwide Hot 50",
                    "desc": "Global music trends aggregated daily",
                    "ratio": "16:9"
                },

                {
                    "type": "asia",
                    "language": None,
                    "title": "Asia Top Hits",
                    "desc": "Cross-storefront hits in Asia",
                    "ratio": "16:9"
                },

                {
                    "type": "india",
                    "language": None,
                    "title": "India Superhits Top 50",
                    "desc": "India's highest trending editorial hits",
                    "ratio": "16:9"
                }

            ]

            for lang in LanguageConfig.get_active_languages():

                if lang == "india":
                    continue

                charts_to_load.append({

                    "type": "language",

                    "language": lang,

                    "title": f"{lang.title()} Top 50",

                    "desc": f"Editorial top hits in {lang.title()}",

                    "ratio": "4:5"

                })

            overview_results = []

            for chart in charts_to_load:

                cached = ChartRepository.get_chart(
                    chart["type"],
                    chart["language"]
                )

                if not cached:

                    ChartService.refresh_async(
                        chart["type"],
                        chart["language"]
                    )

                    overview_results.append(

                        ChartNormalizer.placeholder(

                            chart,

                            ChartService.PLACEHOLDER_COVERS[
                                chart["type"]
                            ]

                        )

                    )

                    continue

                fresh_hours = (
                    24
                    if chart["type"] in (
                        "worldwide",
                        "asia"
                    )
                    else 6
                )

                if (
                    not refresh
                    and
                    not ChartRepository.is_cache_fresh(
                        cached,
                        fresh_hours
                    )
                ):

                    ChartService.refresh_async(
                        chart["type"],
                        chart["language"]
                    )

                tracks = cached.get(
                    "tracks",
                    []
                )

                cover = (
                    tracks[0].get("cover")
                    if tracks
                    else ChartService.PLACEHOLDER_COVERS[
                        chart["type"]
                    ]
                )

                overview_results.append(

                    ChartNormalizer.overview(

                        chart,

                        cover,

                        len(tracks)

                    )

                )

            return {

                "charts": overview_results

            }

        fresh_hours = (
            24
            if chart_type in (
                "worldwide",
                "asia"
            )
            else 6
        )

        cached = ChartRepository.get_chart(
            chart_type,
            language
        )

        if (
            cached
            and
            not refresh
        ):

            if not ChartRepository.is_cache_fresh(
                cached,
                fresh_hours
            ):

                ChartService.refresh_async(
                    chart_type,
                    language
                )

            return ChartNormalizer.detail(

                cached.get(
                    "tracks",
                    []
                ),

                cached.get(
                    "source",
                    "jiosaavn"
                )

            )

        ChartService.refresh_chart(
            chart_type,
            language
        )

        cached = ChartRepository.get_chart(
            chart_type,
            language
        )

        if not cached:

            return {

                "tracks": [],

                "source": "jiosaavn"

            }

        return ChartNormalizer.detail(

            cached.get(
                "tracks",
                []
            ),

            cached.get(
                "source",
                "jiosaavn"
            )

        )