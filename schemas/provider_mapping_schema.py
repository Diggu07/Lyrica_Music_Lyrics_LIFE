from datetime import datetime, timezone
from typing import Any, Dict, Literal
from pydantic import BaseModel, Field


class ProviderMappingSchema(BaseModel):
    """
    Maps an external provider entity to a canonical Lyrica entity.

    Example:
        JioSaavn Song ID  -> song_123
        YouTube Video ID -> song_123
        Apple Track ID   -> song_123
    """

    # ------------------------------------------------------------------
    # Identity
    # ------------------------------------------------------------------

    mappingId: str

    entityType: Literal[
        "song",
        "artist",
        "album",
        "playlist",
        "lyrics"
    ]

    canonicalId: str

    # ------------------------------------------------------------------
    # Provider
    # ------------------------------------------------------------------

    provider: Literal[
        "saavn",
        "youtube",
        "apple",
        "lrclib"
    ]

    providerId: str

    # ------------------------------------------------------------------
    # Provider-specific Metadata
    # ------------------------------------------------------------------

    metadata: Dict[str, Any] = Field(default_factory=dict)

    # ------------------------------------------------------------------
    # Status
    # ------------------------------------------------------------------

    isActive: bool = True

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