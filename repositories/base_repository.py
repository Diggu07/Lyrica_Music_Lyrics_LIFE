from typing import Any, Dict, List, Optional

from bson import ObjectId

from database.mongo import get_db


class BaseRepository:
    """
    Base repository providing generic MongoDB CRUD operations.

    Child repositories only need to define:

        collection_name = "songs"

    and implement domain-specific queries.
    """

    collection_name: str = ""

    # ---------------------------------------------------------
    # Collection
    # ---------------------------------------------------------

    @classmethod
    def collection(cls):
        if not cls.collection_name:
            raise ValueError(
                f"{cls.__name__} must define collection_name."
            )

        return get_db()[cls.collection_name]

    # ---------------------------------------------------------
    # Serialization
    # ---------------------------------------------------------

    @staticmethod
    def serialize(document: Optional[Dict]) -> Optional[Dict]:

        if document is None:
            return None

        document = dict(document)

        if "_id" in document:
            document["_id"] = str(document["_id"])

        return document

    @classmethod
    def serialize_many(cls, documents: List[Dict]) -> List[Dict]:

        return [
            cls.serialize(document)
            for document in documents
        ]

    # ---------------------------------------------------------
    # Read
    # ---------------------------------------------------------

    @classmethod
    def find_one(
        cls,
        query: Dict
    ) -> Optional[Dict]:

        return cls.serialize(
            cls.collection().find_one(query)
        )

    @classmethod
    def find(
        cls,
        query: Dict = None,
        limit: int = 0,
        sort=None
    ) -> List[Dict]:

        query = query or {}

        cursor = cls.collection().find(query)

        if sort:
            cursor = cursor.sort(sort)

        if limit:
            cursor = cursor.limit(limit)

        return cls.serialize_many(
            list(cursor)
        )

    # ---------------------------------------------------------
    # Create
    # ---------------------------------------------------------

    @classmethod
    def insert_one(
        cls,
        document: Dict
    ) -> str:

        result = cls.collection().insert_one(
            document
        )

        return str(result.inserted_id)

    # ---------------------------------------------------------
    # Update
    # ---------------------------------------------------------

    @classmethod
    def update_one(
        cls,
        query: Dict,
        values: Dict
    ) -> bool:

        result = cls.collection().update_one(
            query,
            {
                "$set": values
            }
        )

        return result.modified_count > 0

    @classmethod
    def upsert(
        cls,
        query: Dict,
        values: Dict
    ):

        cls.collection().update_one(
            query,
            {
                "$set": values
            },
            upsert=True
        )

    @classmethod
    def upsert_schema(
        cls,
        schema,
        key: str
    ):
    
        document = schema.model_dump(
            exclude_none=True
        )
    
        cls.upsert(
        
            {
            
                key: document[key]
    
            },
    
            document
    
        )

    # ---------------------------------------------------------
    # Delete
    # ---------------------------------------------------------

    @classmethod
    def delete_one(
        cls,
        query: Dict
    ) -> bool:

        result = cls.collection().delete_one(
            query
        )

        return result.deleted_count > 0

    # ---------------------------------------------------------
    # Exists
    # ---------------------------------------------------------

    @classmethod
    def exists(
        cls,
        query: Dict
    ) -> bool:

        return (
            cls.collection().count_documents(
                query,
                limit=1
            )
            > 0
        )

    # ---------------------------------------------------------
    # Count
    # ---------------------------------------------------------

    @classmethod
    def count(
        cls,
        query: Dict = None
    ) -> int:

        return cls.collection().count_documents(
            query or {}
        )

    # ---------------------------------------------------------
    # ObjectId Helper
    # ---------------------------------------------------------

    @staticmethod
    def object_id(id_: str) -> ObjectId:

        return ObjectId(id_)