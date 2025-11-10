from flask import Blueprint, request, jsonify, session
from models.playlist import Playlist

playlist_routes = Blueprint("playlist_routes", __name__)
playlist_obj = Playlist()

@playlist_routes.route('/playlist/create', methods=['POST'])
def create_playlist():
    data = request.get_json()
    user_id = session.get('user_id')
    name = data.get('name')
    playlist_id = playlist_obj.create_playlist(user_id, name)
    return jsonify({"message": "Playlist created", "playlist_id": str(playlist_id)})

@playlist_routes.route('/playlist/all', methods=['GET'])
def get_playlists():
    user_id = session.get('user_id')
    playlists = playlist_obj.get_playlists_by_user(user_id)
    for p in playlists:
        p['_id'] = str(p['_id'])
    return jsonify(playlists)

@playlist_routes.route('/playlist/add_song', methods=['POST'])
def add_song():
    data = request.get_json()
    playlist_obj.add_song(data['playlist_id'], data['song_id'])
    return jsonify({"message": "Song added successfully"})

@playlist_routes.route('/playlist/remove_song', methods=['POST'])
def remove_song():
    data = request.get_json()
    playlist_obj.remove_song(data['playlist_id'], data['song_id'])
    return jsonify({"message": "Song removed"})

@playlist_routes.route('/playlist/delete', methods=['POST'])
def delete_playlist():
    data = request.get_json()
    playlist_obj.delete_playlist(data['playlist_id'])
    return jsonify({"message": "Playlist deleted"})

@playlist_routes.route('/playlist/rename', methods=['POST'])
def rename_playlist():
    data = request.get_json()
    playlist_obj.rename_playlist(data['playlist_id'], data['new_name'])
    return jsonify({"message": "Playlist renamed"})
