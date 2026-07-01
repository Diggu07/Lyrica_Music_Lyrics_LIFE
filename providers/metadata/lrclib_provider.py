# providers/lrclib_provider.py

import requests


class LRCLIBProvider:
    """
    Handles all communication with LRCLIB.

    This class should ONLY make HTTP requests.
    No formatting.
    No parsing.
    No business logic.
    """

    BASE_URL = "https://lrclib.net/api"

    @staticmethod
    def get_lyrics(artist, title, duration=None):
        """
        Fetch lyrics from LRCLIB.

        Returns:
            tuple(dict|None, status_code)
        """

        params = {
            "artist_name": artist,
            "track_name": title,
        }

        if duration:
            try:
                params["duration"] = int(float(duration))
            except (TypeError, ValueError):
                pass

        try:

            response = requests.get(
                f"{LRCLIBProvider.BASE_URL}/get",
                params=params,
                timeout=8,
            )

            # Retry without duration
            if response.status_code == 404 and "duration" in params:

                params.pop("duration")

                response = requests.get(
                    f"{LRCLIBProvider.BASE_URL}/get",
                    params=params,
                    timeout=8,
                )

            if response.status_code == 404:
                return None, 404

            if not response.ok:
                return None, response.status_code

            return response.json(), 200

        except requests.RequestException as e:

            print(f"[LRCLIB] {e}")

            return None, 500