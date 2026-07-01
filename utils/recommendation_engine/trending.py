from repositories.recommendation_repository import (
    RecommendationRepository
)


class TrendingEngine:
    """
    Trending recommendation engine.
    """

    @staticmethod
    def get_trending(
        limit=20
    ):

        return RecommendationRepository.get_trending_songs(
            limit
        )

    @staticmethod
    def get_recent_trending(
        limit=20
    ):

        return RecommendationRepository.get_recent_trending(
            limit=limit
        )

    @staticmethod
    def inject_trending(
        recommendations,
        count=3
    ):

        trending = TrendingEngine.get_trending(
            count
        )

        existing = {
            song["songId"]
            for song in recommendations
        }

        for song in trending:

            if song["songId"] not in existing:

                recommendations.append(song)

        return recommendations