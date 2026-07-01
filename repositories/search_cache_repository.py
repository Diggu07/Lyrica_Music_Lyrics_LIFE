from datetime import datetime, timedelta, timezone

from repositories.base_repository import BaseRepository


class SearchCacheRepository(BaseRepository):
    """
    Repository for search cache.

    Stores provider search responses temporarily
    to reduce external API calls.
    """

    collection_name = "search_cache"

    DEFAULT_TTL_HOURS = 6

    # ---------------------------------------------------------
    # Cache Lookup
    # ---------------------------------------------------------

    @classmethod
    def get(
        cls,
        key: str
    ):

        return cls.find_one({
            "cacheKey": key
        })

    @classmethod
    def exists(
        cls,
        key: str
    ):

        return super().exists({
            "cacheKey": key
        })

    # ---------------------------------------------------------
    # Save
    # ---------------------------------------------------------

    @classmethod
    def save(
        cls,
        key: str,
        value,
        ttl_hours: int = DEFAULT_TTL_HOURS
    ):
    
        now = datetime.now(timezone.utc)
    
        expires = now + timedelta(
            hours=ttl_hours
        )
    
        # ----------------------------------------
        # Serialize Pydantic models
        # ----------------------------------------
    
        if isinstance(value, list):
        
            value = [
                item.model_dump(exclude_none=True)
                if hasattr(item, "model_dump")
                else item
                for item in value
            ]
    
        elif hasattr(value, "model_dump"):
        
            value = value.model_dump(
                exclude_none=True
            )
    
        cls.upsert(
        
            {
                "cacheKey": key
            },
    
            {
                "cacheKey": key,
                "value": value,
                "createdAt": now,
                "expiresAt": expires
            }
    
        )

    # ---------------------------------------------------------
    # Delete
    # ---------------------------------------------------------

    @classmethod
    def delete(
        cls,
        key: str
    ):

        return cls.delete_one({

            "cacheKey": key

        })

    @classmethod
    def clear_expired(cls):

        cls.collection().delete_many({

            "expiresAt": {

                "$lt": datetime.now(timezone.utc)

            }

        })

    # ---------------------------------------------------------
    # Index
    # ---------------------------------------------------------

    @classmethod
    def ensure_indexes(cls):

        cls.collection().create_index(

            "cacheKey",

            unique=True

        )

        cls.collection().create_index(

            "expiresAt",

            expireAfterSeconds=0

        )