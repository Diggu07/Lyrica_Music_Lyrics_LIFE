from flask import Blueprint, jsonify
from flask_login import login_required, current_user

from services.home_service import HomeService

home_bp = Blueprint(
    "home_bp",
    __name__
)


@home_bp.route("", methods=["GET"])
@login_required
def home():

    return jsonify(

        HomeService.get_home(
            current_user.id
        )

    )