import hashlib
import re
import unicodedata
from typing import Iterable, Optional
from utils.text_utils import TextUtils


class CanonicalId:
    """
    Generates deterministic canonical IDs for Lyrica entities.

    The same entity should always produce the same ID,
    regardless of the provider (Saavn, YouTube, Apple, etc.).
    """

    # ---------------------------------------------------------
    # Internal Helpers
    # ---------------------------------------------------------

    @staticmethod
    def _hash(parts: Iterable[str]) -> str:
        """
        Produce a deterministic SHA-1 hash.
        """

        value = "|".join(parts)

        return hashlib.sha1(
            value.encode("utf-8")
        ).hexdigest()

    # ---------------------------------------------------------
    # Song
    # ---------------------------------------------------------

    @staticmethod
    def song(
        title: str,
        artists: list[str],
        album: str = ""
    ) -> str:

        artist_string = ",".join(
            sorted(
                TextUtils.normalize(a)
                for a in artists
            )
        )

        hash_value = CanonicalId._hash([
            TextUtils.normalize(title),
            artist_string,
            TextUtils.normalize(album)
        ])

        return f"song_{hash_value}"

    # ---------------------------------------------------------
    # Artist
    # ---------------------------------------------------------

    @staticmethod
    def artist(
        name: str
    ) -> str:

        hash_value = CanonicalId._hash([
            TextUtils.normalize(name)
        ])

        return f"artist_{hash_value}"

    # ---------------------------------------------------------
    # Album
    # ---------------------------------------------------------

    @staticmethod
    def album(
        title: str,
        artists: list[str]
    ) -> str:

        artist_string = ",".join(
            sorted(
                TextUtils.normalize(a)
                for a in artists
            )
        )

        hash_value = CanonicalId._hash([
            TextUtils.normalize(title),
            artist_string
        ])

        return f"album_{hash_value}"

    # ---------------------------------------------------------
    # Playlist
    # ---------------------------------------------------------

    @staticmethod
    def playlist(
        title: str,
        owner: str
    ):
    
        return CanonicalId.sha1(
        
            f"{TextUtils.normalize(title)}:{TextUtils.normalize(owner)}"
    
        )

    # ---------------------------------------------------------
    # Lyrics
    # ---------------------------------------------------------

    @staticmethod
    def lyrics(
        song_id: str,
        language: str
    ) -> str:

        hash_value = CanonicalId._hash([
            song_id,
            TextUtils.normalize(language)
        ])

        return f"lyrics_{hash_value}"