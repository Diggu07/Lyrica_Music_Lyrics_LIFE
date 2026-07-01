from dataclasses import dataclass
from typing import Optional


@dataclass(slots=True)
class ProviderPlaylistDTO:

    provider: str
    provider_id: str

    title: str
    subtitle: Optional[str]

    owner: Optional[str]

    cover: Optional[str]
    thumbnail: Optional[str]

    language: Optional[str]

    song_count: int

    public: bool