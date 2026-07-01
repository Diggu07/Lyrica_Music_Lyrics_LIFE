import os
import logging
import requests

logger = logging.getLogger(__name__)

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

YT_API_KEY = os.getenv("YOUTUBE_API_KEY")

TIMEOUT = 10

HEADERS = {
    "User-Agent": "Lyrica/1.0"
}

session = requests.Session()


class YTMusicProvider:
    """
    YouTube Music search provider.

    Responsibilities
    ----------------
    • Talk to YouTube Data API
    • Convert responses into Lyrica objects
    • Never access MongoDB
    """

    @staticmethod
    def search(
        query: str,
        search_type: str = "all",
        limit: int = 20
    ) -> list:

        return YTMusicProvider._search(
            query=query,
            search_type=search_type,
            limit=limit
        )

    @staticmethod
    def _search(
        query: str,
        search_type: str = "all",
        limit: int = 20
    ) -> list:

        if not YT_API_KEY:
            logger.error("YouTube API key not configured.")
            return []

        print("[YTMusicProvider] Searching...")
        yt_type = "video"
        video_category = None
        query_suffix = ""

        if search_type == "tracks":
            yt_type = "video"
            video_category = "10"

        elif search_type == "albums":
            yt_type = "playlist"
            query_suffix = " album"

        elif search_type == "artists":
            yt_type = "channel"

        elif search_type == "playlists":
            yt_type = "playlist"

        else:
            yt_type = "video,playlist,channel"

        full_query = query + query_suffix

        params = {
            "part": "snippet",
            "type": yt_type,
            "q": full_query,
            "key": YT_API_KEY,
            "maxResults": min(limit * 2, 40),
        }

        if video_category and yt_type == "video":
            params["videoCategoryId"] = video_category

        try:

            response = session.get(
                YOUTUBE_SEARCH_URL,
                params=params,
                headers=HEADERS,
                timeout=TIMEOUT
            )

            if response.status_code == 403:
                logger.warning("YouTube quota exceeded.")
                return []

            if not response.ok:
                logger.error(
                    "YouTube search failed (%s)",
                    response.status_code
                )
                return []

            items = response.json().get("items", [])

            return YTMusicProvider._normalize_results(
                items,
                search_type,
                limit
            )

        except Exception:
            logger.exception("YouTube search failed")
            return []
        
    @staticmethod
    def _normalize_results(
        items: list,
        search_type: str,
        limit: int
    ) -> list:

        results = []

        exclude_album_keywords = [
            "best of",
            "greatest hits",
            "playlist",
            "mix",
            "collection",
            "hits",
            "fan-made"
        ]

        for item in items:

            kind = item.get("id", {}).get("kind", "")

            snippet = item.get("snippet", {})

            title = snippet.get("title", "")

            title_lower = title.lower()

            channel_title = snippet.get(
                "channelTitle",
                ""
            )

            thumbnail = (
                snippet.get("thumbnails", {})
                .get("medium", {})
                .get("url", "")
                or
                snippet.get("thumbnails", {})
                .get("default", {})
                .get("url", "")
            )

            # --------------------------
            # Track
            # --------------------------

            if "youtube#video" in kind:

                video_id = item["id"]["videoId"]

                results.append({

                    "id": f"yt_{video_id}",

                    "rawId": video_id,

                    "type": "track",

                    "title": title,

                    "subtitle":
                        channel_title.replace(
                            " - Topic",
                            ""
                        )
                        if channel_title.endswith(" - Topic")
                        else channel_title,

                    "cover": thumbnail,

                    "source": "youtube",

                    "videoId": video_id,

                    "duration": "0:00"

                })

            # --------------------------
            # Artist
            # --------------------------

            elif "youtube#channel" in kind:

                channel_id = item["id"]["channelId"]

                results.append({

                    "id": f"yt_artist_{channel_id}",

                    "rawId": channel_id,

                    "type": "artist",

                    "title": title,

                    "subtitle": "Artist • YouTube",

                    "cover": thumbnail,

                    "source": "youtube"

                })

            # --------------------------
            # Playlist / Album
            # --------------------------

            elif "youtube#playlist" in kind:

                playlist_id = item["id"]["playlistId"]

                if search_type == "albums":

                    has_album_keyword = any(

                        keyword in title_lower

                        for keyword in [

                            "album",

                            "ep",

                            "lp",

                            "l.p."

                        ]

                    )

                    has_excluded_keyword = any(

                        keyword in title_lower

                        for keyword in exclude_album_keywords

                    )

                    if not has_album_keyword:

                        continue

                    if has_excluded_keyword:

                        continue

                    results.append({

                        "id":
                            f"yt_album_{playlist_id}",

                        "rawId":
                            playlist_id,

                        "type":
                            "album",

                        "title":
                            title
                            .replace(" - Album", "")
                            .replace(" album", ""),

                        "subtitle":
                            channel_title,

                        "cover":
                            thumbnail,

                        "source":
                            "youtube"

                    })

                else:

                    results.append({

                        "id":
                            f"yt_playlist_{playlist_id}",

                        "rawId":
                            playlist_id,

                        "type":
                            "playlist",

                        "title":
                            title,

                        "subtitle":
                            f"Playlist • {channel_title}",

                        "cover":
                            thumbnail,

                        "source":
                            "youtube"

                    })

        return results[:limit]
    
    @staticmethod
    def _search_fallback(
        query: str,
        limit: int = 10
    ) -> list:
        """
        Fallback search targeting tracks only.
        """

        return YTMusicProvider._search(
            query=query,
            search_type="tracks",
            limit=limit
        )