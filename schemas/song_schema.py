from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class SongSchema(BaseModel):
    """
    Canonical Song model used throughout Lyrica.

    Every provider (JioSaavn, YouTube, Apple, etc.)
    must normalize into this schema.

    Provider-specific IDs are stored separately in
    providerMappings.
    """

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    songId: str

    # ------------------------------------------------------------------
    # Metadata
    # ------------------------------------------------------------------

    title: str

    normalizedTitle: str

    artistIds: List[str] = Field(default_factory=list)

    albumId: Optional[str] = None

    genres: List[str] = Field(default_factory=list)

    language: Optional[str] = None

    explicit: bool = False

    # ------------------------------------------------------------------
    # Artwork
    # ------------------------------------------------------------------

    cover: Optional[str] = None

    thumbnail: Optional[str] = None

    # ------------------------------------------------------------------
    # Duration
    # ------------------------------------------------------------------

    duration: str = "0:00"

    durationSecs: int = 0

    # ------------------------------------------------------------------
    # Statistics
    # ------------------------------------------------------------------

    popularity: float = 0.0

    playCount: int = 0

    likeCount: int = 0

    # ------------------------------------------------------------------
    # Playback
    # ------------------------------------------------------------------

    defaultProvider: Optional[str] = None

    isPlayable: bool = True

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