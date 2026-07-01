from services.metadata_service import MetadataService


class SearchService:

    @staticmethod
    def search(
        query,
        source="saavn",
        search_type="all",
        limit=20
    ):

        return MetadataService.search(
            query=query,
            source=source,
            search_type=search_type,
            limit=limit
        )