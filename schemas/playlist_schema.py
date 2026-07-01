from datetime import datetime, timezone

from pydantic import BaseModel, Field


class PlaylistSchema(BaseModel):

    playlistId: str

    userId: str

    name: str

    description: str = ""

    cover: str | None = None

    songs: list[str] = Field(
        default_factory=list
    )

    isPublic: bool = False

    createdAt: datetime = Field(
        default_factory=lambda:
        datetime.now(timezone.utc)
    )

    updatedAt: datetime = Field(
        default_factory=lambda:
        datetime.now(timezone.utc)
    )