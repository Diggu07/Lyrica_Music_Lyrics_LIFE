class SongNormalizer:

    @staticmethod
    def normalize_youtube_results(data):

        songs = []

        for item in data.get("items", []):

            snippet = item.get("snippet", {})
            video = item.get("id", {})

            songs.append({
                "provider": "youtube",

                "title": snippet.get("title"),

                "artist": snippet.get("channelTitle"),

                "thumbnail": snippet.get("thumbnails", {})
                            .get("medium", {})
                            .get("url"),

                "videoId": video.get("videoId")
            })

        return songs