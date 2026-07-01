from models.user import User


class RecommendationModel:
    """
    MongoDB model for Recommendation Engine.

    This model only manages database connections
    and MongoDB indexes.

    Business logic belongs in services.
    Database queries belong in repositories.
    """

    @staticmethod
    def get_db():
        return User.get_db_connection()

    @staticmethod
    def init_indexes():
        db = RecommendationModel.get_db()

        try:

            # ---------------------------------------------------------
            # Recommendation Cache
            # ---------------------------------------------------------

            db.recommendation_cache.create_index(
                [("userId", 1)],
                unique=True
            )

            db.recommendation_cache.create_index(
                [("generatedAt", -1)]
            )

            # ---------------------------------------------------------
            # Song Activity
            # ---------------------------------------------------------

            db.song_activity.create_index(
                [("userId", 1)]
            )

            db.song_activity.create_index(
                [("songId", 1)]
            )

            db.song_activity.create_index(
                [("playedAt", -1)]
            )

            db.song_activity.create_index(
                [
                    ("userId", 1),
                    ("playedAt", -1)
                ]
            )

            # ---------------------------------------------------------
            # Songs
            # ---------------------------------------------------------

            db.songs.create_index(
                [("songId", 1)],
                unique=True
            )

            db.songs.create_index(
                [("artistId", 1)]
            )

            db.songs.create_index(
                [("albumId", 1)]
            )

            db.songs.create_index(
                [("genre", 1)]
            )

            db.songs.create_index(
                [("releaseDate", -1)]
            )

            db.songs.create_index(
                [("popularity", -1)]
            )

            # ---------------------------------------------------------
            # Artists
            # ---------------------------------------------------------

            db.artists.create_index(
                [("artistId", 1)],
                unique=True
            )

            db.artist_graph.create_index(
                [("source", 1)]
            )

            db.artist_graph.create_index(
                [("target", 1)]
            )

            # ---------------------------------------------------------
            # Albums
            # ---------------------------------------------------------

            db.albums.create_index(
                [("albumId", 1)],
                unique=True
            )

            db.albums.create_index(
                [("artistId", 1)]
            )

            db.albums.create_index(
                [("releaseDate", -1)]
            )

            # ---------------------------------------------------------
            # Playlists
            # ---------------------------------------------------------

            db.playlists.create_index(
                [("userId", 1)]
            )

            db.playlists.create_index(
                [("songs.songId", 1)]
            )

            # ---------------------------------------------------------
            # Users
            # ---------------------------------------------------------

            db.users.create_index(
                [("liked_songs", 1)]
            )

            db.users.create_index(
                [("favorite_artists", 1)]
            )

            print(
                "[DATABASE] Recommendation indexes initialized successfully."
            )

        except Exception as e:

            print(
                f"[DATABASE] Recommendation index error: {e}"
            )

    # ==========================================================
    # Cache Helpers
    # ==========================================================

    @staticmethod
    def get_cached_recommendations(user_id):

        db = RecommendationModel.get_db()

        return db.recommendation_cache.find_one(
            {
                "userId": user_id
            }
        )

    @staticmethod
    def save_cached_recommendations(
        user_id,
        recommendations
    ):

        db = RecommendationModel.get_db()

        db.recommendation_cache.update_one(
            {
                "userId": user_id
            },
            {
                "$set": recommendations
            },
            upsert=True
        )

    @staticmethod
    def clear_cache(user_id):

        db = RecommendationModel.get_db()

        db.recommendation_cache.delete_one(
            {
                "userId": user_id
            }
        )