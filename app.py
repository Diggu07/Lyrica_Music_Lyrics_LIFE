from flask import Flask, jsonify, request
from flask_login import LoginManager, current_user
from models.user import User
from auth import auth_bp
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['WTF_CSRF_ENABLED'] = False

    
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
    
    @login_manager.user_loader
    def load_user(user_id):
        """Load user by ID for Flask-Login"""
        return User.find_by_id(user_id)
    
    app.register_blueprint(auth_bp, url_prefix='/auth')

    @app.route('/')
    def index():
        """API status"""
        return jsonify({"status": "Lyrica API is running", "version": "1.0"})
    
    @app.route('/dashboard')
    def dashboard():
        """User dashboard API"""
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
    
    @app.route('/playlists')
    def playlists():
        """User playlists API"""
        if not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        return jsonify({"playlists": current_user.playlists})
    
    @app.route('/routes', methods=['GET'])
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                'endpoint': rule.endpoint,
                'methods': list(rule.methods - {'HEAD', 'OPTIONS'}),
                'path': str(rule)
            })
        return jsonify({'routes': routes}), 200
    
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Endpoint not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
