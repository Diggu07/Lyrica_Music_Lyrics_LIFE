# app.py
import os
from dotenv import load_dotenv

load_dotenv()  # Must be first so MONGO_URI etc. are available everywhere

# Monkeypatch MongoClient using mongomock for local development without local mongod
try:
    import mongomock
    import pymongo
    pymongo.MongoClient = mongomock.MongoClient
    print("[MONGOMOCK] MongoClient monkeypatched with mongomock successfully!")
except ImportError:
    pass

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import safe_join
from flask_login import LoginManager, current_user
from flask_cors import CORS
from routes.user_routes import user_bp


def try_import(module_path, symbol=None):
    try:
        if symbol:
            mod = __import__(module_path, fromlist=[symbol])
            return getattr(mod, symbol)
        else:
            return __import__(module_path, fromlist=["*"])
    except Exception as e:
        print(f"Warning: failed to import {module_path} {('-> '+symbol) if symbol else ''}: {e}")
        return None

# Import User model if available
User = try_import("models.user", "User")

# Import blueprints (follow the examples below - common name: bp or <name>_bp)
auth_bp = try_import("auth", "auth_bp")
music_bp = try_import("routes.music", "bp") or try_import("routes.music", "music_bp")
playlist_bp = try_import("routes.playlist_routes", "bp") or try_import("routes.playlist_routes", "playlist_routes") or try_import("routes.playlist_routes", "playlist_bp")
user_bp = try_import("routes.user_routes", "user_bp")
song_activity_bp = try_import("routes.song_activity_routes", "bp") or try_import("routes.song_activity_routes", "song_activity_routes")
discover_bp = try_import("routes.discover_routes", "bp") or try_import("routes.discover_routes", "discover_bp")
search_bp = try_import("routes.search_routes", "search_bp")
lyrics_bp = try_import("routes.lyrics_routes", "lyrics_bp")
artist_bp = try_import("routes.artist_routes", "artist_bp")



def create_app():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, "Lyrica", "dist")  # the folder containing index.html (or your build)
    songs_dir = os.path.join(base_dir, "static", "songs")

    app = Flask(
        __name__,
        static_folder=frontend_dir,
        static_url_path=""  # serve frontend files from root paths
    )

    # Basic config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["WTF_CSRF_ENABLED"] = False

    # Session cookie settings for local development (relax for dev; tighten in production)
    app.config["SESSION_COOKIE_SAMESITE"] = None
    app.config["SESSION_COOKIE_SECURE"] = False

    # ---------- CORS ----------
    # Allow frontend dev server to call API. Narrow origins in production.
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

    # ---------- Login Manager ----------
    login_manager = LoginManager(app)
    login_manager.login_view = "auth.login" if auth_bp else None
    login_manager.login_message = "Please log in to access this page."
    login_manager.login_message_category = "info"

    @login_manager.user_loader
    def load_user(user_id):
        if User is None:
            return None
        return User.find_by_id(user_id)

    # ---------- Register blueprints under /api prefixes ----------
    if auth_bp:
        app.register_blueprint(auth_bp, url_prefix="/api/auth")
    if music_bp:
        app.register_blueprint(music_bp, url_prefix="/api/music")
    if playlist_bp:
        app.register_blueprint(playlist_bp, url_prefix="/api/playlists")
    if user_bp:
        app.register_blueprint(user_bp, url_prefix="/api/user")
    if song_activity_bp:
        app.register_blueprint(song_activity_bp, url_prefix="/api/song_activity")
    if discover_bp:
        app.register_blueprint(discover_bp, url_prefix="/api/discover")
    if search_bp:
        app.register_blueprint(search_bp, url_prefix="/api")
    if lyrics_bp:
        app.register_blueprint(lyrics_bp, url_prefix="/api/lyrics")
    if artist_bp:
        app.register_blueprint(artist_bp, url_prefix="/api/artists")



    # ---------- Simple API (ping / route list) ----------
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"}), 200

    @app.route("/api/routes", methods=["GET"])
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                "endpoint": rule.endpoint,
                "methods": sorted(list(rule.methods - {"HEAD", "OPTIONS"})),
                "path": str(rule)
            })
        return jsonify({"routes": routes}), 200

    # ---------- Serve song files safely ----------
    @app.route("/songs/<path:filename>")
    def serve_song(filename):
        # ensure songs dir exists
        if not os.path.isdir(songs_dir):
            return jsonify({"error": "Songs directory not found"}), 404
        try:
            full_path = safe_join(songs_dir, filename)
        except Exception:
            return jsonify({"error": "Invalid filename"}), 400
        if not os.path.exists(full_path):
            return jsonify({"error": "Song not found"}), 404
        return send_from_directory(songs_dir, filename, conditional=True)

    # ---------- Serve playlist cover files safely ----------
    @app.route("/static/playlist_covers/<path:filename>")
    def serve_playlist_cover(filename):
        covers_dir = os.path.join(base_dir, "static", "playlist_covers")
        if not os.path.isdir(covers_dir):
            return jsonify({"error": "Covers directory not found"}), 404
        try:
            full_path = safe_join(covers_dir, filename)
        except Exception:
            return jsonify({"error": "Invalid filename"}), 400
        if not os.path.exists(full_path):
            return jsonify({"error": "Cover not found"}), 404
        return send_from_directory(covers_dir, filename, conditional=True)

    # ---------- Serve frontend app (SPA) ----------
    # If the frontend is built (index.html in frontend/), this serves the app and assets.
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        # If the requested resource exists in the frontend directory, serve it; otherwise return index.html (SPA fallback)
        requested = os.path.join(frontend_dir, path)
        if path != "" and os.path.exists(requested) and os.path.isfile(requested):
            return send_from_directory(frontend_dir, path)
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(frontend_dir, "index.html")
        return jsonify({"error": "Frontend build not found. Please build your frontend into the `frontend/` directory."}), 404

    # ---------- Example protected endpoints (useful for testing) ----------
    @app.route("/api/dashboard")
    def dashboard():
        if not current_user or not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        try:
            return jsonify({
                "user": current_user.to_dict(),
                "stats": {
                    "playlists": len(getattr(current_user, "playlists", [])),
                    "liked_songs": len(getattr(current_user, "liked_songs", [])),
                    "listening_history": len(getattr(current_user, "listening_history", []))
                }
            })
        except Exception as e:
            return jsonify({"error": "Failed to fetch dashboard", "detail": str(e)}), 500

    # ---------- Error handlers ----------
    @app.errorhandler(404)
    def not_found_error(error):
        path = request.path or ""
        # If it's an API path return JSON; otherwise fallback to frontend index.html
        if path.startswith("/api") or path.startswith("/songs") or path.startswith("/auth"):
            return jsonify({"error": "Endpoint not found"}), 404
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(frontend_dir, "index.html")
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

        # ---------- Content Security Policy (CSP) override ----------
    @app.after_request
    def apply_csp(response):
        # Allow YouTube origins for frames, media and connect requests
        # Allow inline styles for style-src-elem to support Vite stylesheet insertions
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com; "
            "connect-src 'self' https://www.googleapis.com https://app.ticketmaster.com https://*.ticketmaster.com https://www.youtube.com; "
            "img-src 'self' data: https: blob:; "
            "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; "
            "media-src 'self' https: blob:; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:;"
        )
        return response
    return app

def seed_demo_user(app):
    """Seed a demo user into the in-memory DB on startup so login always works."""
    with app.app_context():
        try:
            if User is None:
                return
            # Create/verify MongoDB index for liked_songs field
            try:
                db = User.get_db_connection()
                db.users.create_index("liked_songs")
                print("[DB] Created/verified liked_songs index on users collection.")
            except Exception as index_e:
                print(f"[DB] Warning: could not create liked_songs index: {index_e}")

            if not User.find_by_email("demo@lyrica.com"):
                demo = User()
                demo.username = "demo"
                demo.email = "demo@lyrica.com"
                demo.first_name = "Demo"
                demo.last_name = "User"
                demo.password_hash = User.hash_password("Demo1234!").decode("utf-8")
                demo.save()
                print("[SEED] Demo user created: demo@lyrica.com / Demo1234!")
            else:
                print("[SEED] Demo user already exists.")
        except Exception as e:
            print(f"[SEED] Warning: could not seed demo user: {e}")

if __name__ == "__main__":
    app = create_app()
    seed_demo_user(app)
    debug_flag = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=debug_flag)

