import requests
import base64
from datetime import datetime, timedelta
from api.config import APIConfig
from models.song import Song
import json

class SpotifyClient:
    def __init__(self):
        self.client_id = APIConfig.SPOTIFY_CLIENT_ID
        self.client_secret = APIConfig.SPOTIFY_CLIENT_SECRET
        self.base_url = 'https://api.spotify.com/v1'
        self.access_token = None
        self.token_expires_at = None
        
    def _get_access_token(self):
        """Get Spotify access token using client credentials flow"""
        if self.access_token and self.token_expires_at and datetime.now() < self.token_expires_at:
            return self.access_token
            
        # Prepare credentials
        credentials = f"{self.client_id}:{self.client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        # Request token
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {'grant_type': 'client_credentials'}
        
        try:
            response = requests.post('https://accounts.spotify.com/api/token', 
                                   headers=headers, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            self.access_token = token_data['access_token']
            expires_in = token_data.get('expires_in', 3600)
            self.token_expires_at = datetime.now() + timedelta(seconds=expires_in - 60)
            
            return self.access_token
            
        except requests.RequestException as e:
            print(f"Error getting Spotify access token: {e}")
            return None
    
    def _make_request(self, endpoint, params=None):
        """Make authenticated request to Spotify API"""
        token = self._get_access_token()
        if not token:
            return None
            
        headers = {'Authorization': f'Bearer {token}'}
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error making Spotify API request: {e}")
            return None
    
    def search_tracks(self, query, limit=20, market='US'):
        """Search for tracks on Spotify"""
        params = {
            'q': query,
            'type': 'track',
            'limit': limit,
            'market': market
        }
        
        data = self._make_request('/search', params)
        if not data or 'tracks' not in data:
            return []
        
        tracks = []
        for track in data['tracks']['items']:
            song = self._convert_spotify_track_to_song(track)
            if song:
                tracks.append(song)
        
        return tracks
    
    def get_track_by_id(self, track_id):
        """Get track details by Spotify ID"""
        data = self._make_request(f'/tracks/{track_id}')
        if data:
            return self._convert_spotify_track_to_song(data)
        return None
    
    def get_featured_playlists(self, limit=20, market='US'):
        """Get Spotify's featured playlists"""
        params = {
            'limit': limit,
            'market': market
        }
        
        data = self._make_request('/browse/featured-playlists', params)
        if not data or 'playlists' not in data:
            return []
        
        return data['playlists']['items']
    
    def get_new_releases(self, limit=20, market='US'):
        """Get new album releases"""
        params = {
            'limit': limit,
            'market': market
        }
        
        data = self._make_request('/browse/new-releases', params)
        if not data or 'albums' not in data:
            return []
        
        albums = []
        for album in data['albums']['items']:
            # Get tracks from each album
            album_tracks = self.get_album_tracks(album['id'])
            albums.extend(album_tracks)
        
        return albums[:limit]  # Limit total tracks returned
    
    def get_album_tracks(self, album_id, limit=50):
        """Get tracks from an album"""
        params = {'limit': limit}
        data = self._make_request(f'/albums/{album_id}/tracks', params)
        
        if not data or 'items' not in data:
            return []
        
        tracks = []
        for track in data['items']:
            # Get full track details
            full_track = self.get_track_by_id(track['id'])
            if full_track:
                tracks.append(full_track)
        
        return tracks
    
    def get_trending_tracks(self, limit=20, market='US'):
        """Get trending tracks (using featured playlists and new releases)"""
        trending_tracks = []
        
        # Get tracks from featured playlists
        featured_playlists = self.get_featured_playlists(limit=5, market=market)
        for playlist in featured_playlists:
            playlist_tracks = self.get_playlist_tracks(playlist['id'], limit=10)
            trending_tracks.extend(playlist_tracks)
        
        # Get new releases
        new_releases = self.get_new_releases(limit=10, market=market)
        trending_tracks.extend(new_releases)
        
        # Remove duplicates and limit results
        seen_ids = set()
        unique_tracks = []
        for track in trending_tracks:
            if track.spotify_id not in seen_ids:
                seen_ids.add(track.spotify_id)
                unique_tracks.append(track)
        
        return unique_tracks[:limit]
    
    def get_playlist_tracks(self, playlist_id, limit=50):
        """Get tracks from a playlist"""
        params = {'limit': limit}
        data = self._make_request(f'/playlists/{playlist_id}/tracks', params)
        
        if not data or 'items' not in data:
            return []
        
        tracks = []
        for item in data['items']:
            if 'track' in item and item['track']:
                track = item['track']
                song = self._convert_spotify_track_to_song(track)
                if song:
                    tracks.append(song)
        
        return tracks
    
    def _convert_spotify_track_to_song(self, track_data):
        """Convert Spotify track data to Song object"""
        try:
            song = Song()
            song.title = track_data.get('name')
            song.spotify_id = track_data.get('id')
            song.duration = track_data.get('duration_ms', 0) // 1000  # Convert to seconds
            song.explicit = track_data.get('explicit', False)
            song.popularity = track_data.get('popularity', 0)
            song.preview_url = track_data.get('preview_url')
            
            # Extract artist information
            artists = track_data.get('artists', [])
            if artists:
                song.artist = ', '.join([artist['name'] for artist in artists])
            
            # Extract album information
            album = track_data.get('album', {})
            if album:
                song.album = album.get('name')
                song.year = album.get('release_date', '').split('-')[0] if album.get('release_date') else None
                
                # Get album image
                images = album.get('images', [])
                if images:
                    song.image_url = images[0].get('url')
            
            return song
            
        except Exception as e:
            print(f"Error converting Spotify track: {e}")
            return None
    
    def save_tracks_to_database(self, tracks):
        """Save tracks to database"""
        saved_count = 0
        for track in tracks:
            try:
                # Check if track already exists
                existing = Song.find_by_spotify_id(track.spotify_id)
                if not existing:
                    track.save()
                    saved_count += 1
            except Exception as e:
                print(f"Error saving track {track.title}: {e}")
        
        return saved_count
