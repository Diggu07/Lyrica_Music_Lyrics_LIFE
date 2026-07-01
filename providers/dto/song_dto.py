from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(slots=True)
class SongDTO:
    """
    Provider-independent song representation.

    Every provider (Saavn, YouTube, Apple, Spotify, etc.)
    should convert its raw response into this DTO.
    """

    provider: str

    provider_id: str

    title: str

    artists: List[str] = field(default_factory=list)

    album: Optional[str] = None

    cover: Optional[str] = None

    thumbnail: Optional[str] = None

    duration: str = "0:00"

    durationSecs: int = 0

    language: Optional[str] = None

    genres: List[str] = field(default_factory=list)

    stream_url: Optional[str] = None

    playable: bool = True

    explicit: bool = False

    popularity: float = 0.0

    releaseDate: Optional[str] = None

    year: Optional[int] = None

    isrc: Optional[str] = None

    lyrics_available: bool = False