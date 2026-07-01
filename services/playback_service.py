from providers.playback.jiosaavn_provider import JioSaavnProvider


class PlaybackService:

    @staticmethod
    def get_stream(song_id: str, quality: str = "160kbps"):
        """
        Get a playable stream URL for a song.
        """

        return JioSaavnProvider.get_stream(song_id, quality)