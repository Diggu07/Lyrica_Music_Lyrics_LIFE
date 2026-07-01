from flask import Blueprint, jsonify
from flask_login import login_required, current_user

from services.library_service import LibraryService


library_bp = Blueprint(

    "library",

    __name__

)


@library_bp.route(
    "",
    methods=["GET"]
)
# @login_required
def get_library():

    return jsonify(

        LibraryService.get_library(

            "demo"

        )

    )