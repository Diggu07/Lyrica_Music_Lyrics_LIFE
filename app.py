from flask import Flask, jsonify, request, send_from_directory
from flask_login import LoginManager, current_user
from models.user import User
from auth import auth_bp
from routes.music import music_bp
from routes.playlist_routes import playlist_routes
from routes.song_activity_routes import song_activity_routes
from routes.discover_routes import discover_bp
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__,
                static_folder="frontend",
                static_url_path="")  # Serve frontend from root

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    app.config["WTF_CSRF_ENABLED"] = False

    # ------------------- LOGIN MANAGER -------------------
    login_manager = LoginManager(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this page."
    login_manager.login_message_category = "info"

    @login_manager.user_loader
    def load_user(user_id):
        return User.find_by_id(user_id)

    # ------------------- BLUEPRINTS ----------------------
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(music_bp)
    app.register_blueprint(playlist_routes)
    app.register_blueprint(song_activity_routes)
    app.register_blueprint(discover_bp)

    # ------------------- SONG SERVING ---------------------
    @app.route("/songs/<path:filename>")
    def serve_song(filename):
        """Serve MP3 files from static/songs folder"""
        songs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "songs")
        file_path = os.path.join(songs_dir, filename)
        print("🟣 Trying to serve:", file_path)

        if not os.path.exists(file_path):
            print("❌ File not found:", file_path)
            return jsonify({"error": "Song not found"}), 404

        return send_from_directory(songs_dir, filename, mimetype="audio/mpeg")

    # ------------------- FRONTEND ROUTES -----------------
    FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

    @app.route("/")
    def serve_frontend():
        return send_from_directory(FRONTEND_DIR, "index.html")

    @app.route("/<path:filename>")
    def serve_static_frontend(filename):
        return send_from_directory(FRONTEND_DIR, filename)

    # ------------------- API ROUTES -----------------------
    @app.route("/dashboard")
    def dashboard():
        if not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        return jsonify({
            "user": current_user.to_dict(),
            "stats": {
                "playlists": len(current_user.playlists),
                "liked_songs": len(current_user.liked_songs),
                "listening_history": len(current_user.listening_history)
            }
        })

    @app.route("/playlists")
    def playlists():
        if not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        return jsonify({"playlists": current_user.playlists})

    @app.route("/routes", methods=["GET"])
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                "endpoint": rule.endpoint,
                "methods": list(rule.methods - {"HEAD", "OPTIONS"}),
                "path": str(rule)
            })
        return jsonify({"routes": routes}), 200

    # ------------------- ERROR HANDLERS -------------------
    @app.errorhandler(404)
    def not_found_error(error):
        path = request.path
        if path.startswith(("/songs", "/auth", "/dashboard", "/playlists")):
            return jsonify({"error": "Endpoint not found"}), 404
        return send_from_directory("frontend", "index.html")

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
from flask import Flask, jsonify, request, send_from_directory
from flask_login import LoginManager, current_user
from models.user import User
from auth import auth_bp
from routes.music import music_bp
from routes.playlist_routes import playlist_routes
from routes.song_activity_routes import song_activity_routes
from routes.discover_routes import discover_bp
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__,
                static_folder="frontend",
                static_url_path="")  # Serve frontend from root

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    app.config["WTF_CSRF_ENABLED"] = False

    # ------------------- LOGIN MANAGER -------------------
    login_manager = LoginManager(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this page."
    login_manager.login_message_category = "info"

    @login_manager.user_loader
    def load_user(user_id):
        return User.find_by_id(user_id)

    # ------------------- BLUEPRINTS ----------------------
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(music_bp)
    app.register_blueprint(playlist_routes)
    app.register_blueprint(song_activity_routes)
    app.register_blueprint(discover_bp)

    # ------------------- SONG SERVING ---------------------
    @app.route("/songs/<path:filename>")
    def serve_song(filename):
        """Serve MP3 files from static/songs folder"""
        songs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "songs")
        file_path = os.path.join(songs_dir, filename)
        print("🟣 Trying to serve:", file_path)

        if not os.path.exists(file_path):
            print("❌ File not found:", file_path)
            return jsonify({"error": "Song not found"}), 404

        return send_from_directory(songs_dir, filename, mimetype="audio/mpeg")

    # ------------------- FRONTEND ROUTES -----------------
    FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

    @app.route("/")
    def serve_frontend():
        return send_from_directory(FRONTEND_DIR, "index.html")

    @app.route("/<path:filename>")
    def serve_static_frontend(filename):
        return send_from_directory(FRONTEND_DIR, filename)

    # ------------------- API ROUTES -----------------------
    @app.route("/dashboard")
    def dashboard():
        if not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        return jsonify({
            "user": current_user.to_dict(),
            "stats": {
                "playlists": len(current_user.playlists),
                "liked_songs": len(current_user.liked_songs),
                "listening_history": len(current_user.listening_history)
            }
        })

    @app.route("/playlists")
    def playlists():
        if not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        return jsonify({"playlists": current_user.playlists})

    @app.route("/routes", methods=["GET"])
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                "endpoint": rule.endpoint,
                "methods": list(rule.methods - {"HEAD", "OPTIONS"}),
                "path": str(rule)
            })
        return jsonify({"routes": routes}), 200

    # ------------------- ERROR HANDLERS -------------------
    @app.errorhandler(404)
    def not_found_error(error):
        path = request.path
        if path.startswith(("/songs", "/auth", "/dashboard", "/playlists")):
            return jsonify({"error": "Endpoint not found"}), 404
        return send_from_directory("frontend", "index.html")

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
