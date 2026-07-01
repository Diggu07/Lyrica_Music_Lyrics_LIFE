from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(slots=True)
class ArtistDTO:
    """
    Provider-independent artist representation.
    """

    provider: str

    provider_id: str

    name: str

    image: Optional[str] = None

    banner: Optional[str] = None

    bio: Optional[str] = None

    country: Optional[str] = None

    genres: List[str] = field(default_factory=list)

    aliases: List[str] = field(default_factory=list)

    popularity: float = 0.0

    followers: int = 0

    monthlyListeners: int = 0

    socialLinks: Dict[str, str] = field(default_factory=dict)