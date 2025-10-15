"""
Main music API routes for fetching song data from external services
"""
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from api.spotify_client import SpotifyClient
from api.youtube_client import YouTubeClient
from models.song import Song
from api.config import APIConfig
import json

# Create music API blueprint
music_api_bp = Blueprint('music_api', __name__)

@music_api_bp.route('/search', methods=['GET'])
@login_required
def search_songs():
    """Search for songs across multiple platforms"""
    query = request.args.get('q', '').strip()
    limit = min(int(request.args.get('limit', 20)), 50)  # Max 50 results
    platform = request.args.get('platform', 'all')  # all, spotify, youtube
    
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    
    results = {
        'query': query,
        'platform': platform,
        'results': []
    }
    
    try:
        # Search in database first
        db_results = Song.search_songs(query, limit=limit)
        results['results'].extend([song.to_dict() for song in db_results])
        
        # If not enough results or platform specified, search external APIs
        if len(results['results']) < limit:
            remaining_limit = limit - len(results['results'])
            
            if platform in ['all', 'spotify'] and APIConfig.is_spotify_configured():
                spotify_client = SpotifyClient()
                spotify_results = spotify_client.search_tracks(query, limit=remaining_limit)
                
                # Save new tracks to database
                new_tracks = [track for track in spotify_results 
                            if not Song.find_by_spotify_id(track.spotify_id)]
                if new_tracks:
                    spotify_client.save_tracks_to_database(new_tracks)
                
                # Add to results
                for track in spotify_results:
                    if len(results['results']) < limit:
                        results['results'].append(track.to_dict())
            
            if platform in ['all', 'youtube'] and APIConfig.is_youtube_configured():
                youtube_client = YouTubeClient()
                youtube_results = youtube_client.search_music_videos(query, max_results=remaining_limit)
                
                # Save new videos to database
                new_videos = [video for video in youtube_results 
                            if not Song.find_by_spotify_id(video.youtube_id)]  # Using spotify_id field for youtube_id
                if new_videos:
                    youtube_client.save_videos_to_database(new_videos)
                
                # Add to results
                for video in youtube_results:
                    if len(results['results']) < limit:
                        results['results'].append(video.to_dict())
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}"}), 500

@music_api_bp.route('/trending', methods=['GET'])
@login_required
def get_trending_songs():
    """Get trending songs from multiple platforms"""
    limit = min(int(request.args.get('limit', 20)), 50)
    platform = request.args.get('platform', 'all')
    
    results = {
        'platform': platform,
        'trending': []
    }
    
    try:
        # Get trending from database
        db_trending = Song.get_trending_songs(limit=limit)
        results['trending'].extend([song.to_dict() for song in db_trending])
        
        # If not enough results, fetch from external APIs
        if len(results['trending']) < limit:
            remaining_limit = limit - len(results['trending'])
            
            if platform in ['all', 'spotify'] and APIConfig.is_spotify_configured():
                spotify_client = SpotifyClient()
                spotify_trending = spotify_client.get_trending_tracks(limit=remaining_limit)
                
                # Save new tracks
                new_tracks = [track for track in spotify_trending 
                            if not Song.find_by_spotify_id(track.spotify_id)]
                if new_tracks:
                    spotify_client.save_tracks_to_database(new_tracks)
                
                # Add to results
                for track in spotify_trending:
                    if len(results['trending']) < limit:
                        results['trending'].append(track.to_dict())
            
            if platform in ['all', 'youtube'] and APIConfig.is_youtube_configured():
                youtube_client = YouTubeClient()
                youtube_trending = youtube_client.get_trending_music_videos(max_results=remaining_limit)
                
                # Save new videos
                new_videos = [video for video in youtube_trending 
                            if not Song.find_by_spotify_id(video.youtube_id)]
                if new_videos:
                    youtube_client.save_videos_to_database(new_videos)
                
                # Add to results
                for video in youtube_trending:
                    if len(results['trending']) < limit:
                        results['trending'].append(video.to_dict())
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({"error": f"Failed to get trending songs: {str(e)}"}), 500

@music_api_bp.route('/song/<song_id>', methods=['GET'])
@login_required
def get_song_details(song_id):
    """Get detailed information about a specific song"""
    try:
        song = Song.find_by_id(song_id)
        if not song:
            return jsonify({"error": "Song not found"}), 404
        
        # Increment play count
        song.increment_play_count()
        
        return jsonify(song.to_dict())
        
    except Exception as e:
        return jsonify({"error": f"Failed to get song details: {str(e)}"}), 500

@music_api_bp.route('/genres', methods=['GET'])
@login_required
def get_genres():
    """Get available music genres"""
    try:
        # This would typically come from a genres collection or external API
        genres = [
            'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical',
            'Folk', 'Reggae', 'Blues', 'Metal', 'Punk', 'Alternative', 'Indie', 'Funk',
            'Soul', 'Gospel', 'Latin', 'World', 'Ambient', 'Dance', 'House', 'Techno'
        ]
        
        return jsonify({"genres": genres})
        
    except Exception as e:
        return jsonify({"error": f"Failed to get genres: {str(e)}"}), 500

@music_api_bp.route('/genre/<genre>', methods=['GET'])
@login_required
def get_songs_by_genre(genre):
    """Get songs by genre"""
    limit = min(int(request.args.get('limit', 20)), 50)
    
    try:
        songs = Song.get_songs_by_genre(genre, limit=limit)
        return jsonify({
            "genre": genre,
            "songs": [song.to_dict() for song in songs]
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to get songs by genre: {str(e)}"}), 500

@music_api_bp.route('/preview/<song_id>', methods=['GET'])
@login_required
def get_song_preview(song_id):
    """Get song preview URL"""
    try:
        song = Song.find_by_id(song_id)
        if not song:
            return jsonify({"error": "Song not found"}), 404
        
        if not song.preview_url:
            return jsonify({"error": "No preview available"}), 404
        
        return jsonify({
            "song_id": song_id,
            "preview_url": song.preview_url,
            "title": song.title,
            "artist": song.artist
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to get preview: {str(e)}"}), 500

@music_api_bp.route('/like/<song_id>', methods=['POST'])
@login_required
def like_song(song_id):
    """Like a song"""
    try:
        song = Song.find_by_id(song_id)
        if not song:
            return jsonify({"error": "Song not found"}), 404
        
        # Add to user's liked songs
        current_user.like_song(song_id)
        
        # Increment song's like count
        song.increment_like_count()
        
        return jsonify({
            "message": "Song liked successfully",
            "song_id": song_id,
            "like_count": song.like_count
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to like song: {str(e)}"}), 500

@music_api_bp.route('/unlike/<song_id>', methods=['POST'])
@login_required
def unlike_song(song_id):
    """Unlike a song"""
    try:
        song = Song.find_by_id(song_id)
        if not song:
            return jsonify({"error": "Song not found"}), 404
        
        # Remove from user's liked songs
        current_user.unlike_song(song_id)
        
        return jsonify({
            "message": "Song unliked successfully",
            "song_id": song_id
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to unlike song: {str(e)}"}), 500

@music_api_bp.route('/play/<song_id>', methods=['POST'])
@login_required
def play_song(song_id):
    """Record song play"""
    try:
        song = Song.find_by_id(song_id)
        if not song:
            return jsonify({"error": "Song not found"}), 404
        
        # Add to user's listening history
        current_user.add_to_history(song_id)
        
        # Increment play count
        song.increment_play_count()
        
        return jsonify({
            "message": "Song play recorded",
            "song_id": song_id,
            "play_count": song.play_count
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to record play: {str(e)}"}), 500

@music_api_bp.route('/status', methods=['GET'])
def api_status():
    """Get API status and configuration"""
    return jsonify({
        "status": "Music API is running",
        "version": "1.0",
        "configured_services": {
            "spotify": APIConfig.is_spotify_configured(),
            "youtube": APIConfig.is_youtube_configured(),
            "lastfm": APIConfig.is_lastfm_configured()
        },
        "endpoints": {
            "search": "/api/music/search?q=query&limit=20&platform=all",
            "trending": "/api/music/trending?limit=20&platform=all",
            "song_details": "/api/music/song/<song_id>",
            "genres": "/api/music/genres",
            "genre_songs": "/api/music/genre/<genre>",
            "preview": "/api/music/preview/<song_id>",
            "like": "/api/music/like/<song_id>",
            "play": "/api/music/play/<song_id>"
        }
    })
