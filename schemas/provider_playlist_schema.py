from datetime import datetime, timezone

from pydantic import BaseModel, Field


class ProviderPlaylistSchema(BaseModel):

    playlistId: str

    provider: str

    providerId: str

    title: str

    normalizedTitle: str

    subtitle: str | None = None

    owner: str | None = None

    cover: str | None = None

    thumbnail: str | None = None

    language: str | None = None

    songCount: int = 0

    songIds: list[str] = Field(
        default_factory=list
    )

    isPublic: bool = True

    createdAt: datetime = Field(
        default_factory=lambda:
        datetime.now(timezone.utc)
    )

    updatedAt: datetime = Field(
        default_factory=lambda:
        datetime.now(timezone.utc)
    )