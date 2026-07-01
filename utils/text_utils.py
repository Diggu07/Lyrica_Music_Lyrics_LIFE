import re
import unicodedata
from typing import List


class TextUtils:
    """
    Shared text normalization utilities used throughout Lyrica.

    Every provider, repository, and service should use these
    methods instead of implementing its own regex logic.
    """

    # ---------------------------------------------------------
    # Basic Normalization
    # ---------------------------------------------------------

    @staticmethod
    def normalize(text: str) -> str:
        """
        Normalize text for searching, hashing and comparison.
        """

        if not text:
            return ""

        # Unicode normalization
        text = unicodedata.normalize("NFKD", text)

        # Remove accents
        text = "".join(
            c
            for c in text
            if not unicodedata.combining(c)
        )

        text = text.lower().strip()

        text = TextUtils.remove_feature_tags(text)

        text = TextUtils.remove_version_tags(text)

        text = TextUtils.remove_punctuation(text)

        text = re.sub(
            r"\s+",
            " ",
            text
        )

        return text.strip()

    # ---------------------------------------------------------
    # Remove "(feat. ...)"
    # ---------------------------------------------------------

    @staticmethod
    def remove_feature_tags(text: str) -> str:

        patterns = [

            r"\(feat\..*?\)",

            r"\(ft\..*?\)",

            r"\(featuring.*?\)",

            r"\(with.*?\)"

        ]

        for pattern in patterns:

            text = re.sub(
                pattern,
                "",
                text,
                flags=re.IGNORECASE
            )

        return text

    # ---------------------------------------------------------
    # Remove Remix / Live / Radio Edit
    # ---------------------------------------------------------

    @staticmethod
    def remove_version_tags(text: str) -> str:

        patterns = [

            r"\s*-\s*remix.*",

            r"\s*-\s*live.*",

            r"\s*-\s*radio edit.*",

            r"\s*-\s*extended.*",

            r"\s*-\s*acoustic.*",

            r"\s*-\s*instrumental.*"

        ]

        for pattern in patterns:

            text = re.sub(
                pattern,
                "",
                text,
                flags=re.IGNORECASE
            )

        return text

    # ---------------------------------------------------------
    # Remove punctuation
    # ---------------------------------------------------------

    @staticmethod
    def remove_punctuation(text: str) -> str:

        return re.sub(
            r"[^\w\s]",
            "",
            text
        )

    # ---------------------------------------------------------
    # Tokenization
    # ---------------------------------------------------------

    @staticmethod
    def tokenize(text: str) -> List[str]:

        text = TextUtils.normalize(text)

        return text.split()

    # ---------------------------------------------------------
    # Artist Helpers
    # ---------------------------------------------------------

    @staticmethod
    def split_artists(text: str) -> List[str]:

        if not text:
            return []

        separators = [

            ",",

            "&",

            " x ",

            " and ",

            ";"

        ]

        artists = [text]

        for sep in separators:

            new_list = []

            for artist in artists:

                new_list.extend(
                    artist.split(sep)
                )

            artists = new_list

        return [

            TextUtils.normalize(a)

            for a in artists

            if a.strip()

        ]

    # ---------------------------------------------------------
    # Album Helpers
    # ---------------------------------------------------------

    @staticmethod
    def clean_album(title: str) -> str:

        return TextUtils.normalize(title)

    # ---------------------------------------------------------
    # Song Helpers
    # ---------------------------------------------------------

    @staticmethod
    def clean_title(title: str) -> str:

        return TextUtils.normalize(title)

    # ---------------------------------------------------------
    # Comparison
    # ---------------------------------------------------------

    @staticmethod
    def equals(a: str, b: str) -> bool:

        return (

            TextUtils.normalize(a)

            ==

            TextUtils.normalize(b)

        )

    @staticmethod
    def word_overlap(a: str, b: str) -> float:
        """
        Returns overlap ratio between two normalized strings.
        """

        words_a = set(
            TextUtils.tokenize(a)
        )

        words_b = set(
            TextUtils.tokenize(b)
        )

        if not words_a or not words_b:
            return 0.0

        return (

            len(words_a & words_b)

            /

            len(words_b)

        )