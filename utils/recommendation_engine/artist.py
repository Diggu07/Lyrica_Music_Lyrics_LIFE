from repositories.recommendation_repository import (
    RecommendationRepository
)


class ArtistEngine:

    """
    Artist based recommendation logic.
    """

    @staticmethod
    def get_related_artists(
        artist_id
    ):

        return RecommendationRepository.get_artist_neighbors(
            artist_id
        )

    @staticmethod
    def recommend_from_artist(
        artist_id,
        limit=20
    ):

        return RecommendationRepository.get_songs_by_artist(
            artist_id,
            limit
        )

    @staticmethod
    def recommend_from_related(
        artist_id,
        limit=20
    ):

        related = ArtistEngine.get_related_artists(
            artist_id
        )

        return RecommendationRepository.get_songs_by_artist_ids(
            related,
            limit
        )
    
    @staticmethod
    def recommend_from_multiple_related(
        artist_ids,
        limit=100
    ):
        """
        Recommend songs from artists related to
        multiple artists in one batch.
        """

        edges = RecommendationRepository.get_related_artists_bulk(
            artist_ids
        )

        related = set()

        for edge in edges:

            source = edge.get("source")
            target = edge.get("target")

            if source:
                related.add(source)

            if target:
                related.add(target)

        # Don't recommend the original artists
        related.difference_update(artist_ids)

        return RecommendationRepository.get_songs_by_artist_ids(
            list(related),
            limit
        )

    @staticmethod
    def build_artist_profile(
        artist_id
    ):

        return {

            "artist":

                RecommendationRepository.get_artist(
                    artist_id
                ),

            "related":

                ArtistEngine.get_related_artists(
                    artist_id
                )

        }
    
    @staticmethod
    def recommend_from_multiple_related(
        artist_ids,
        limit=100
    ):

        related = set()

        for artist in artist_ids:

            related.update(
                ArtistEngine.get_related_artists(
                    artist
                )
            )

        return RecommendationRepository.get_songs_by_artist_ids(
            list(related),
            limit
        )