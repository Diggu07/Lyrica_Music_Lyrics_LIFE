from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(slots=True)
class AlbumDTO:
    """
    Provider-independent album representation.
    """

    provider: str

    provider_id: str

    title: str

    artists: List[str] = field(default_factory=list)

    cover: Optional[str] = None

    thumbnail: Optional[str] = None

    releaseDate: Optional[str] = None

    year: Optional[int] = None

    language: Optional[str] = None

    genres: List[str] = field(default_factory=list)

    totalTracks: int = 0

    popularity: float = 0.0

    label: Optional[str] = None

    album_type: Optional[str] = None