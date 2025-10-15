"""
YouTube API client for fetching music videos and metadata
"""
import requests
from api.config import APIConfig
from models.song import Song
import json

class YouTubeClient:
    def __init__(self):
        self.api_key = APIConfig.YOUTUBE_API_KEY
        self.base_url = APIConfig.YOUTUBE_API_URL
        
    def _make_request(self, endpoint, params):
        """Make request to YouTube API"""
        params['key'] = self.api_key
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error making YouTube API request: {e}")
            return None
    
    def search_music_videos(self, query, max_results=20):
        """Search for music videos on YouTube"""
        params = {
            'part': 'snippet',
            'q': f"{query} music",
            'type': 'video',
            'maxResults': max_results,
            'videoCategoryId': '10',  # Music category
            'order': 'relevance'
        }
        
        data = self._make_request('/search', params)
        if not data or 'items' not in data:
            return []
        
        videos = []
        for item in data['items']:
            video = self._convert_youtube_video_to_song(item)
            if video:
                videos.append(video)
        
        return videos
    
    def get_video_details(self, video_id):
        """Get detailed information about a video"""
        params = {
            'part': 'snippet,statistics,contentDetails',
            'id': video_id
        }
        
        data = self._make_request('/videos', params)
        if not data or 'items' not in data or not data['items']:
            return None
        
        return self._convert_youtube_video_to_song(data['items'][0], include_stats=True)
    
    def get_trending_music_videos(self, max_results=20, region_code='US'):
        """Get trending music videos"""
        params = {
            'part': 'snippet',
            'chart': 'mostPopular',
            'regionCode': region_code,
            'maxResults': max_results,
            'videoCategoryId': '10'  # Music category
        }
        
        data = self._make_request('/videos', params)
        if not data or 'items' not in data:
            return []
        
        videos = []
        for item in data['items']:
            video = self._convert_youtube_video_to_song(item, include_stats=True)
            if video:
                videos.append(video)
        
        return videos
    
    def search_by_artist(self, artist_name, max_results=20):
        """Search for music videos by artist"""
        query = f"{artist_name} official music video"
        return self.search_music_videos(query, max_results)
    
    def get_related_videos(self, video_id, max_results=20):
        """Get videos related to a specific video"""
        # First get the video details to extract search terms
        video_details = self.get_video_details(video_id)
        if not video_details:
            return []
        
        # Use the title and artist to find related videos
        search_query = f"{video_details.title} {video_details.artist}"
        return self.search_music_videos(search_query, max_results)
    
    def _convert_youtube_video_to_song(self, video_data, include_stats=False):
        """Convert YouTube video data to Song object"""
        try:
            song = Song()
            
            # Basic video information
            snippet = video_data.get('snippet', {})
            song.title = snippet.get('title', '').replace(' - Topic', '')  # Remove YouTube Music suffix
            song.youtube_id = video_data.get('id')
            song.image_url = snippet.get('thumbnails', {}).get('high', {}).get('url')
            
            # Extract artist and title from video title
            title_parts = song.title.split(' - ')
            if len(title_parts) >= 2:
                song.artist = title_parts[0].strip()
                song.title = title_parts[1].strip()
            else:
                song.artist = snippet.get('channelTitle', 'Unknown Artist')
            
            # Video description as album info
            description = snippet.get('description', '')
            if 'Album:' in description:
                album_line = [line for line in description.split('\n') if 'Album:' in line]
                if album_line:
                    song.album = album_line[0].replace('Album:', '').strip()
            
            # Published date as year
            published_at = snippet.get('publishedAt', '')
            if published_at:
                song.year = published_at.split('-')[0]
            
            # Duration from contentDetails if available
            if include_stats and 'contentDetails' in video_data:
                duration = video_data['contentDetails'].get('duration', '')
                if duration:
                    song.duration = self._parse_duration(duration)
            
            # Statistics if available
            if include_stats and 'statistics' in video_data:
                stats = video_data['statistics']
                song.popularity = int(stats.get('viewCount', 0)) // 1000  # Convert to smaller number
                song.like_count = int(stats.get('likeCount', 0))
            
            return song
            
        except Exception as e:
            print(f"Error converting YouTube video: {e}")
            return None
    
    def _parse_duration(self, duration_str):
        """Parse YouTube duration string (PT4M13S) to seconds"""
        try:
            # Remove PT prefix
            duration_str = duration_str.replace('PT', '')
            
            hours = 0
            minutes = 0
            seconds = 0
            
            if 'H' in duration_str:
                hours_part = duration_str.split('H')[0]
                hours = int(hours_part)
                duration_str = duration_str.split('H')[1]
            
            if 'M' in duration_str:
                minutes_part = duration_str.split('M')[0]
                minutes = int(minutes_part)
                duration_str = duration_str.split('M')[1]
            
            if 'S' in duration_str:
                seconds_part = duration_str.split('S')[0]
                seconds = int(seconds_part)
            
            return hours * 3600 + minutes * 60 + seconds
            
        except:
            return 0
    
    def save_videos_to_database(self, videos):
        """Save YouTube videos to database"""
        saved_count = 0
        for video in videos:
            try:
                # Check if video already exists
                existing = Song.find_by_spotify_id(video.youtube_id)  # Using spotify_id field for youtube_id
                if not existing:
                    video.save()
                    saved_count += 1
            except Exception as e:
                print(f"Error saving video {video.title}: {e}")
        
        return saved_count
