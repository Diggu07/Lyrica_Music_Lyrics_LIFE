from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, Field


class ArtistSchema(BaseModel):
    """
    Canonical Artist model for Lyrica.

    Every provider (JioSaavn, YouTube, Apple, etc.)
    must normalize into this schema.
    """

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    artistId: str

    # ------------------------------------------------------------------
    # Basic Information
    # ------------------------------------------------------------------

    name: str

    normalizedName: str

    aliases: List[str] = Field(default_factory=list)

    # ------------------------------------------------------------------
    # Media
    # ------------------------------------------------------------------

    image: Optional[str] = None

    banner: Optional[str] = None

    # ------------------------------------------------------------------
    # Metadata
    # ------------------------------------------------------------------

    bio: Optional[str] = None

    country: Optional[str] = None

    genres: List[str] = Field(default_factory=list)

    # ------------------------------------------------------------------
    # Statistics
    # ------------------------------------------------------------------

    popularity: float = 0.0

    followers: int = 0

    monthlyListeners: int = 0

    # ------------------------------------------------------------------
    # External Links
    # ------------------------------------------------------------------

    socialLinks: dict = Field(default_factory=dict)

    # ------------------------------------------------------------------
    # Timestamps
    # ------------------------------------------------------------------

    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updatedAt: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Config:
        populate_by_name = True
        extra = "ignore"