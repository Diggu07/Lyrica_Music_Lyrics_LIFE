from datetime import datetime, timezone

from database.mongo import get_db
from schemas.provider_mapping_schema import ProviderMappingSchema


class ProviderMappingRepository:
    """
    Repository for providerMappings collection.

    Responsible for mapping external provider IDs
    (Saavn, YouTube, Apple, etc.) to canonical Lyrica IDs.
    """

    collection_name = "providerMappings"

    @classmethod
    def collection():
        return get_db()[ProviderMappingRepository.COLLECTION]

    # ---------------------------------------------------------
    # Create / Upsert
    # ---------------------------------------------------------

    @classmethod
    def upsert(mapping: ProviderMappingSchema):

        collection = ProviderMappingRepository.collection()

        mapping.updatedAt = datetime.now(timezone.utc)

        collection.update_one(
            {
                "provider": mapping.provider,
                "entityType": mapping.entityType,
                "providerId": mapping.providerId
            },
            {
                "$set": mapping.model_dump()
            },
            upsert=True
        )

    # ---------------------------------------------------------
    # Read
    # ---------------------------------------------------------

    @classmethod
    def get_by_provider(
        provider: str,
        entity_type: str,
        provider_id: str
    ):

        return ProviderMappingRepository.collection().find_one(
            {
                "provider": provider,
                "entityType": entity_type,
                "providerId": provider_id
            }
        )

    @classmethod
    def get_by_canonical(
        canonical_id: str,
        entity_type: str
    ):

        return list(
            ProviderMappingRepository.collection().find(
                {
                    "canonicalId": canonical_id,
                    "entityType": entity_type
                }
            )
        )

    @classmethod
    def exists(
        provider: str,
        entity_type: str,
        provider_id: str
    ):

        return (
            ProviderMappingRepository.get_by_provider(
                provider,
                entity_type,
                provider_id
            )
            is not None
        )

    # ---------------------------------------------------------
    # Update
    # ---------------------------------------------------------

    @classmethod
    def update_metadata(
        provider: str,
        entity_type: str,
        provider_id: str,
        metadata: dict
    ):

        ProviderMappingRepository.collection().update_one(
            {
                "provider": provider,
                "entityType": entity_type,
                "providerId": provider_id
            },
            {
                "$set": {
                    "metadata": metadata,
                    "updatedAt": datetime.now(timezone.utc)
                }
            }
        )

    # ---------------------------------------------------------
    # Delete
    # ---------------------------------------------------------

    @classmethod
    def delete(
        provider: str,
        entity_type: str,
        provider_id: str
    ):

        ProviderMappingRepository.collection().delete_one(
            {
                "provider": provider,
                "entityType": entity_type,
                "providerId": provider_id
            }
        )

    @classmethod
    def delete_canonical(
        canonical_id: str,
        entity_type: str
    ):

        ProviderMappingRepository.collection().delete_many(
            {
                "canonicalId": canonical_id,
                "entityType": entity_type
            }
        )