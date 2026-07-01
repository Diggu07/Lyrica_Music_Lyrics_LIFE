from datetime import datetime, timezone, timedelta

from models.recommendation import RecommendationModel


class RecommendationRepository:
    """
    Handles all MongoDB operations for recommendations.

    Responsibilities:
    - User retrieval
    - Song retrieval
    - Artist retrieval
    - Playlist retrieval
    - Listening history
    - Trending
    - Recommendation cache

    NO business logic belongs here.
    """
    collection_name = "recommendation"
    # ==========================================================
    # Database
    # ==========================================================

    @staticmethod
    def get_db():
        return RecommendationModel.get_db()

    # ==========================================================
    # Users
    # ==========================================================

    @staticmethod
    def get_user(user_id):

        db = RecommendationRepository.get_db()

        return db.users.find_one(
            {
                "_id": user_id
            }
        )

    @staticmethod
    def get_user_by_email(email):

        db = RecommendationRepository.get_db()

        return db.users.find_one(
            {
                "email": email
            }
        )

    @staticmethod
    def get_user_liked_songs(user_id):

        db = RecommendationRepository.get_db()

        user = db.users.find_one(
            {
                "_id": user_id
            },
            {
                "liked_songs": 1
            }
        )

        if not user:
            return []

        return user.get(
            "liked_songs",
            []
        )

    @staticmethod
    def get_user_favorite_artists(user_id):

        db = RecommendationRepository.get_db()

        user = db.users.find_one(
            {
                "_id": user_id
            },
            {
                "favorite_artists": 1
            }
        )

        if not user:
            return []

        return user.get(
            "favorite_artists",
            []
        )

    # ==========================================================
    # Songs
    # ==========================================================

    @staticmethod
    def get_song(song_id):

        db = RecommendationRepository.get_db()

        return db.songs.find_one(
            {
                "songId": song_id
            }
        )

    @staticmethod
    def get_all_songs():

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find()
        )

    @staticmethod
    def get_song_ids():

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find(
                {},
                {
                    "_id": 0,
                    "songId": 1
                }
            )
        )

    @staticmethod
    def get_songs(song_ids):

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find(
                {
                    "songId": {
                        "$in": song_ids
                    }
                }
            )
        )

    @staticmethod
    def get_popular_songs(limit=20):

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find()
            .sort(
                "popularity",
                -1
            )
            .limit(limit)
        )

    @staticmethod
    def get_recent_releases(limit=20):

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find()
            .sort(
                "releaseDate",
                -1
            )
            .limit(limit)
        )

    @staticmethod
    def get_songs_by_artist(
        artist_id,
        limit=None
    ):

        db = RecommendationRepository.get_db()

        cursor = db.songs.find(
            {
                "artistId": artist_id
            }
        )

        if limit:
            cursor = cursor.limit(limit)

        return list(cursor)
    
    
    @staticmethod
    def get_songs_by_artist_ids(
        artist_ids,
        limit=100
    ):
    
        db = RecommendationRepository.get_db()
    
        return list(
            db.songs.find(
                {
                    "artistId": {
                        "$in": artist_ids
                    }
                }
            ).limit(limit)
        )
    
    @staticmethod
    def get_songs_by_album(
        album_id
    ):

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find(
                {
                    "albumId": album_id
                }
            )
        )

    @staticmethod
    def get_songs_by_genre(
        genre,
        limit=50
    ):

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find(
                {
                    "genre": genre
                }
            ).limit(limit)
        )

    @staticmethod
    def search_song_title(
        query,
        limit=20
    ):

        db = RecommendationRepository.get_db()

        return list(
            db.songs.find(
                {
                    "title": {
                        "$regex": query,
                        "$options": "i"
                    }
                }
            ).limit(limit)
        )
    
    @staticmethod
    def get_songs_in_order(song_ids):

        songs = RecommendationRepository.get_songs(song_ids)

        lookup = {
            song["songId"]: song
            for song in songs
        }

        return [
            lookup[song_id]
            for song_id in song_ids
            if song_id in lookup
        ]
    
    # ==========================================================
    # Artists
    # ==========================================================

    @staticmethod
    def get_artist(artist_id):

        db = RecommendationRepository.get_db()

        return db.artists.find_one(
            {
                "artistId": artist_id
            }
        )

    @staticmethod
    def get_artists(artist_ids):

        db = RecommendationRepository.get_db()

        return list(
            db.artists.find(
                {
                    "artistId": {
                        "$in": artist_ids
                    }
                }
            )
        )

    @staticmethod
    def get_all_artists():

        db = RecommendationRepository.get_db()

        return list(
            db.artists.find()
        )

    @staticmethod
    def search_artist(name, limit=20):

        db = RecommendationRepository.get_db()

        return list(
            db.artists.find(
                {
                    "name": {
                        "$regex": name,
                        "$options": "i"
                    }
                }
            ).limit(limit)
        )

    # ==========================================================
    # Artist Graph
    # ==========================================================

    @staticmethod
    def get_related_artists(artist_id):

        db = RecommendationRepository.get_db()

        return list(
            db.artist_graph.find(
                {
                    "$or": [
                        {
                            "source": artist_id
                        },
                        {
                            "target": artist_id
                        }
                    ]
                }
            )
        )

    @staticmethod
    def get_artist_neighbors(artist_id):

        edges = RecommendationRepository.get_related_artists(
            artist_id
        )

        neighbors = []

        for edge in edges:

            if edge["source"] == artist_id:
                neighbors.append(edge["target"])
            else:
                neighbors.append(edge["source"])

        return neighbors

    # ==========================================================
    # Albums
    # ==========================================================

    @staticmethod
    def get_album(album_id):

        db = RecommendationRepository.get_db()

        return db.albums.find_one(
            {
                "albumId": album_id
            }
        )

    @staticmethod
    def get_albums(album_ids):

        db = RecommendationRepository.get_db()

        return list(
            db.albums.find(
                {
                    "albumId": {
                        "$in": album_ids
                    }
                }
            )
        )

    @staticmethod
    def get_all_albums():

        db = RecommendationRepository.get_db()

        return list(
            db.albums.find()
        )

    @staticmethod
    def get_artist_albums(
        artist_id,
        limit=None
    ):

        db = RecommendationRepository.get_db()

        cursor = db.albums.find(
            {
                "artistId": artist_id
            }
        )

        if limit:
            cursor = cursor.limit(limit)

        return list(cursor)

    @staticmethod
    def get_latest_albums(limit=20):

        db = RecommendationRepository.get_db()

        return list(
            db.albums.find()
            .sort(
                "releaseDate",
                -1
            )
            .limit(limit)
        )

    # ==========================================================
    # Playlists
    # ==========================================================

    @staticmethod
    def get_playlist(playlist_id):

        db = RecommendationRepository.get_db()

        return db.playlists.find_one(
            {
                "playlistId": playlist_id
            }
        )

    @staticmethod
    def get_user_playlists(user_id):

        db = RecommendationRepository.get_db()

        return list(
            db.playlists.find(
                {
                    "userId": user_id
                }
            )
        )

    @staticmethod
    def get_public_playlists(limit=100):

        db = RecommendationRepository.get_db()

        return list(
            db.playlists.find(
                {
                    "visibility": "public"
                }
            ).limit(limit)
        )

    @staticmethod
    def get_playlists_containing_song(song_id):

        db = RecommendationRepository.get_db()

        return list(
            db.playlists.find(
                {
                    "songs.songId": song_id
                }
            )
        )

    @staticmethod
    def get_playlist_song_ids(playlist_id):

        playlist = RecommendationRepository.get_playlist(
            playlist_id
        )

        if not playlist:
            return []

        songs = playlist.get(
            "songs",
            []
        )

        return [
            song["songId"]
            for song in songs
            if "songId" in song
        ]
    
        # ==========================================================
    # Listening History
    # ==========================================================

    @staticmethod
    def get_user_history(user_id, limit=100):

        db = RecommendationRepository.get_db()

        return list(
            db.song_activity.find(
                {
                    "userId": user_id
                }
            )
            .sort(
                "playedAt",
                -1
            )
            .limit(limit)
        )

    @staticmethod
    def get_recently_played(user_id, limit=20):

        db = RecommendationRepository.get_db()

        return list(
            db.song_activity.find(
                {
                    "userId": user_id
                }
            )
            .sort(
                "playedAt",
                -1
            )
            .limit(limit)
        )

    @staticmethod
    def get_most_played(user_id, limit=20):

        db = RecommendationRepository.get_db()

        pipeline = [
            {
                "$match": {
                    "userId": user_id
                }
            },
            {
                "$group": {
                    "_id": "$songId",
                    "plays": {
                        "$sum": 1
                    }
                }
            },
            {
                "$sort": {
                    "plays": -1
                }
            },
            {
                "$limit": limit
            }
        ]

        return list(
            db.song_activity.aggregate(pipeline)
        )

    # ==========================================================
    # Trending
    # ==========================================================

    @staticmethod
    def get_trending_songs(limit=20):

        db = RecommendationRepository.get_db()

        pipeline = [

            {
                "$group": {
                    "_id": "$songId",
                    "plays": {
                        "$sum": 1
                    }
                }
            },

            {
                "$sort": {
                    "plays": -1
                }
            },

            {
                "$limit": limit
            }

        ]

        trending = list(
            db.song_activity.aggregate(
                pipeline
            )
        )

        song_ids = [
            song["_id"]
            for song in trending
        ]

        return RecommendationRepository.get_songs(
            song_ids
        )

    @staticmethod
    def get_recent_trending(days=7, limit=20):

        db = RecommendationRepository.get_db()

        cutoff = datetime.now(
            timezone.utc
        ) - timedelta(days=days)

        pipeline = [

            {
                "$match": {
                    "playedAt": {
                        "$gte": cutoff
                    }
                }
            },

            {
                "$group": {
                    "_id": "$songId",
                    "plays": {
                        "$sum": 1
                    }
                }
            },

            {
                "$sort": {
                    "plays": -1
                }
            },

            {
                "$limit": limit
            }

        ]

        trending = list(
            db.song_activity.aggregate(
                pipeline
            )
        )

        song_ids = [
            song["_id"]
            for song in trending
        ]

        return RecommendationRepository.get_songs(
            song_ids
        )

    # ==========================================================
    # Recommendation Cache
    # ==========================================================

    @staticmethod
    def get_cached_recommendations(user_id):

        db = RecommendationRepository.get_db()

        return db.recommendation_cache.find_one(
            {
                "userId": user_id
            }
        )

    @staticmethod
    def save_recommendations(
        user_id,
        recommendations
    ):

        db = RecommendationRepository.get_db()

        db.recommendation_cache.update_one(
            {
                "userId": user_id
            },
            {
                "$set": {
                    "userId": user_id,
                    "recommendations": recommendations,
                    "generatedAt": datetime.now(
                        timezone.utc
                    )
                }
            },
            upsert=True
        )

    @staticmethod
    def clear_cache(user_id):

        db = RecommendationRepository.get_db()

        db.recommendation_cache.delete_one(
            {
                "userId": user_id
            }
        )

    # ==========================================================
    # Generic Helpers
    # ==========================================================

    @staticmethod
    def aggregate(collection, pipeline):

        db = RecommendationRepository.get_db()

        return list(
            db[collection].aggregate(
                pipeline
            )
        )

    @staticmethod
    def serialize(document):

        if not document:
            return None

        if isinstance(document, list):
            return [
                RecommendationRepository.serialize(d)
                for d in document
            ]

        if "_id" in document:
            document["_id"] = str(document["_id"])

        return document
    
    # ==========================================================
    # Recommendation Cache
    # ==========================================================

    @staticmethod
    def get_cached_recommendations(user_id):

        db = RecommendationRepository.get_db()

        return db.recommendation_cache.find_one(
            {
                "userId": user_id
            }
        )

    @staticmethod
    def save_recommendations(
        user_id,
        recommendations
    ):

        db = RecommendationRepository.get_db()

        db.recommendation_cache.update_one(
            {
                "userId": user_id
            },
            {
                "$set": {
                    "userId": user_id,
                    "recommendations": recommendations,
                    "generatedAt": datetime.now(
                        timezone.utc
                    )
                }
            },
            upsert=True
        )

    @staticmethod
    def clear_cache(user_id):

        db = RecommendationRepository.get_db()

        db.recommendation_cache.delete_one(
            {
                "userId": user_id
            }
        )

    # ==========================================================
    # Ordered Song Retrieval
    # ==========================================================

    @staticmethod
    def get_songs_in_order(song_ids):
        """
        MongoDB does not preserve the order of documents
        returned by $in. This helper restores the ranking order.
        """

        songs = RecommendationRepository.get_songs(
            song_ids
        )

        lookup = {
            song["songId"]: song
            for song in songs
        }

        return [
            lookup[song_id]
            for song_id in song_ids
            if song_id in lookup
        ]

    # ==========================================================
    # Bulk Artist Graph
    # ==========================================================

    @staticmethod
    def get_related_artists_bulk(
        artist_ids
    ):

        db = RecommendationRepository.get_db()

        return list(
            db.artist_graph.find(
                {
                    "$or": [
                        {
                            "source": {
                                "$in": artist_ids
                            }
                        },
                        {
                            "target": {
                                "$in": artist_ids
                            }
                        }
                    ]
                }
            )
        )

    # ==========================================================
    # Generic Aggregation
    # ==========================================================

    @staticmethod
    def aggregate(
        collection,
        pipeline
    ):

        db = RecommendationRepository.get_db()

        return list(
            db[collection].aggregate(
                pipeline
            )
        )

    # ==========================================================
    # Serialization
    # ==========================================================

    @staticmethod
    def serialize(document):

        if not document:
            return None

        if isinstance(document, list):

            return [
                RecommendationRepository.serialize(doc)
                for doc in document
            ]

        document = dict(document)

        if "_id" in document:

            document["_id"] = str(
                document["_id"]
            )

        return document