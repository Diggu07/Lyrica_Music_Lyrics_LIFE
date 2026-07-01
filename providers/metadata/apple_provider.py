import requests


class AppleProvider:

    LOOKUP_URL = "https://itunes.apple.com/lookup"
    WORLDWIDE_URL = "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/songs.json"

    ASIA_STOREFRONTS = [
    "in",
    "jp",
    "kr",
    "id",
    "ph",
    "th",
    "vn",
    "sg",
    "my"
    ]



    @staticmethod
    def get_worldwide():
        """
        Returns raw Apple worldwide chart.
        """
    
        try:
            response = requests.get(
                AppleProvider.WORLDWIDE_URL,
                timeout=10
            )
    
            response.raise_for_status()
    
            return (
                response.json()
                .get("feed", {})
                .get("results", [])
            )
    
        except requests.RequestException as e:
            print(f"[AppleProvider] get_worldwide failed: {e}")
            return []
    
    
    @staticmethod
    def get_asia():
        """
        Aggregate charts from all Asian storefronts.
        """

        track_data = {}

        for storefront in AppleProvider.ASIA_STOREFRONTS:

            url = (
                f"https://rss.applemarketingtools.com/api/v2/"
                f"{storefront}/music/most-played/25/songs.json"
            )

            try:

                response = requests.get(
                    url,
                    timeout=5
                )

                response.raise_for_status()

                results = (
                    response.json()
                    .get("feed", {})
                    .get("results", [])
                )

                for rank, track in enumerate(results, 1):

                    key = (
                        track["name"].lower().strip(),
                        track["artistName"].lower().strip()
                    )

                    if key not in track_data:

                        track_data[key] = {
                            "title": track.get("name"),
                            "artist": track.get("artistName"),
                            "cover": track.get("artworkUrl100").replace(
                                "100x100bb.jpg",
                                "500x500bb.jpg"
                            ),
                            "apple_id": track.get("id"),
                            "ranks": {}
                        }

                    track_data[key]["ranks"][storefront] = rank

            except Exception as e:

                print(
                    f"[AppleProvider] {storefront}: {e}"
                )

        ranked = []

        for _, item in track_data.items():

            freq = len(item["ranks"])

            avg = (
                sum(item["ranks"].values())
                / freq
            )

            ranked.append(
                (
                    freq,
                    avg,
                    item
                )
            )

        ranked.sort(
            key=lambda x: (-x[0], x[1])
        )

        return [item for _, _, item in ranked[:50]]
    
    
    @staticmethod
    def lookup_tracks(apple_ids):
        """
        Fetch album and duration metadata for Apple Music tracks.
        Returns:
        {
            "123456789": {
                "album": "...",
                "duration": "3:45",
                "duration_secs": 225
            }
        }
        """

        if not apple_ids:
            return {}

        try:
            ids = ",".join(map(str, apple_ids))

            response = requests.get(
                AppleProvider.LOOKUP_URL,
                params={"id": ids},
                timeout=8
            )

            response.raise_for_status()

            metadata = {}

            for item in response.json().get("results", []):

                track_id = str(item.get("trackId", ""))

                duration_ms = item.get("trackTimeMillis", 0)
                duration_secs = duration_ms // 1000

                metadata[track_id] = {
                    "album": item.get("collectionName", ""),
                    "duration": f"{duration_secs // 60}:{duration_secs % 60:02d}",
                    "duration_secs": duration_secs
                }

            return metadata

        except requests.RequestException as e:
            print(f"[AppleProvider] lookup_tracks failed: {e}")
            return {}