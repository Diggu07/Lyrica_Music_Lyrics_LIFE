from flask import Blueprint, jsonify, request

from services.recommendation_service import RecommendationService


recommendation_bp = Blueprint(
    "recommendation",
    __name__,
    url_prefix="/recommendations"
)


# ==========================================================
# Health
# ==========================================================

@recommendation_bp.get("/health")
def health():

    return jsonify(
        RecommendationService.get_health()
    )


# ==========================================================
# Trending
# ==========================================================

@recommendation_bp.get("/trending")
def trending():

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_trending(
            limit
        )
    )


# ==========================================================
# Popular
# ==========================================================

@recommendation_bp.get("/popular")
def popular():

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_popular(
            limit
        )
    )


# ==========================================================
# New Releases
# ==========================================================

@recommendation_bp.get("/new-releases")
def new_releases():

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_new_releases(
            limit
        )
    )


# ==========================================================
# Similar Songs
# ==========================================================

@recommendation_bp.get("/similar/<song_id>")
def similar(song_id):

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_similar(
            song_id,
            limit
        )
    )


# ==========================================================
# Artist Recommendations
# ==========================================================

@recommendation_bp.get("/artist/<artist_id>")
def artist(artist_id):

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_artist_recommendations(
            artist_id,
            limit
        )
    )


# ==========================================================
# Genre Recommendations
# ==========================================================

@recommendation_bp.get("/genre/<genre>")
def genre(genre):

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_genre_recommendations(
            genre,
            limit
        )
    )


# ==========================================================
# For You
# ==========================================================

@recommendation_bp.get("/for-you")
def for_you():

    # Temporary until authentication is implemented
    user_id = "demo"

    limit = request.args.get(
        "limit",
        default=20,
        type=int
    )

    return jsonify(
        RecommendationService.get_for_you(
            user_id,
            limit
        )
    )