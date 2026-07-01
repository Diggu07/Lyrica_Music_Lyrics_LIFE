from flask import Blueprint, jsonify

from services.discover_service import DiscoverService


bp = Blueprint(
    "discover",
    __name__
)


@bp.route(
    "",
    methods=["GET"]
)
def discover():

    return jsonify(

        DiscoverService.get_discover()

    )