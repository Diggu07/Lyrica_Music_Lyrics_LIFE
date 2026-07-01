from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, Field


class AlbumSchema(BaseModel):
    """
    Canonical Album model for Lyrica.

    Every provider (JioSaavn, YouTube, Apple, etc.)
    must normalize into this schema.
    """

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    albumId: str

    # ------------------------------------------------------------------
    # Basic Information
    # ------------------------------------------------------------------

    title: str

    normalizedTitle: str

    artistIds: List[str] = Field(default_factory=list)

    # ------------------------------------------------------------------
    # Media
    # ------------------------------------------------------------------

    cover: Optional[str] = None

    thumbnail: Optional[str] = None

    # ------------------------------------------------------------------
    # Release Information
    # ------------------------------------------------------------------

    releaseDate: Optional[datetime] = None

    year: Optional[int] = None

    totalTracks: int = 0

    language: Optional[str] = None

    genres: List[str] = Field(default_factory=list)

    # ------------------------------------------------------------------
    # Statistics
    # ------------------------------------------------------------------

    popularity: float = 0.0

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