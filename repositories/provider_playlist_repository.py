from repositories.base_repository import BaseRepository
from schemas.provider_playlist_schema import ProviderPlaylistSchema

from utils.text_utils import TextUtils

import re


class ProviderPlaylistRepository(BaseRepository):

    collection_name = "providerPlaylists"

    @classmethod
    def save(
        cls,
        playlist: ProviderPlaylistSchema
    ):
        cls.upsert_schema(
            playlist,
            key="playlistId"
        )

    @classmethod
    def get(
        cls,
        playlist_id: str
    ):
        return cls.find_one({
            "playlistId": playlist_id
        })

    @classmethod
    def exists(
        cls,
        playlist_id: str
    ):
        return super().exists({
            "playlistId": playlist_id
        })

    @classmethod
    def delete(
        cls,
        playlist_id: str
    ):
        return cls.delete_one({
            "playlistId": playlist_id
        })

    @classmethod
    def search(
        cls,
        query,
        limit=20
    ):
        escaped = re.escape(
            TextUtils.normalize(query)
        )

        return cls.find(

            {

                "$or": [

                    {

                        "title": {

                            "$regex": escaped,

                            "$options": "i"

                        }

                    },

                    {

                        "normalizedTitle": {

                            "$regex": escaped,

                            "$options": "i"

                        }

                    }

                ]

            },

            limit=limit

        )

    @classmethod
    def get_all(
        cls,
        limit=100
    ):
        return cls.find(
            {},
            limit=limit
        )
    
    @classmethod
    def get_featured(
        cls,
        limit=10
    ):
    
        return cls.find(
        
            {
            
                "isPublic": True
    
            },
    
            limit=limit
    
        )
    
    
    @classmethod
    def get_by_language(
        cls,
        language,
        limit=20
    ):
    
        return cls.find(
        
            {
            
                "language": language
    
            },
    
            limit=limit
    
        )
    
    
    @classmethod
    def get_popular(
        cls,
        limit=20
    ):
    
        return cls.find(
        
            {},
    
            sort=[
            
                ("songCount", -1)
    
            ],
    
            limit=limit
    
        )