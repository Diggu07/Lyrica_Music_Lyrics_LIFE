from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, Field


class LyricLine(BaseModel):
    """
    Represents a single synchronized lyric line.
    """

    time: float

    text: str


class LyricsSchema(BaseModel):
    """
    Canonical Lyrics model for Lyrica.

    Lyrics are stored separately from Songs so that
    multiple providers and languages can coexist.
    """

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    lyricId: str

    songId: str

    # ------------------------------------------------------------------
    # Provider
    # ------------------------------------------------------------------

    provider: str

    providerLyricsId: Optional[str] = None

    # ------------------------------------------------------------------
    # Metadata
    # ------------------------------------------------------------------

    language: Optional[str] = None

    synced: bool = False

    # ------------------------------------------------------------------
    # Content
    # ------------------------------------------------------------------

    plainLyrics: str = ""

    syncedLyrics: List[LyricLine] = Field(default_factory=list)

    # ------------------------------------------------------------------
    # Credits
    # ------------------------------------------------------------------

    contributors: List[str] = Field(default_factory=list)

    copyright: Optional[str] = None

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