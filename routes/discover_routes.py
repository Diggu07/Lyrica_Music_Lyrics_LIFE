"""
Discover routes (concerts + recommended).
"""
from flask import Blueprint, jsonify, request
import os
import requests
from datetime import datetime
import math

bp = Blueprint("discover", __name__)
TM_API = os.getenv('TICKETMASTER_API_KEY')

# Temporary storage for last Ticketmaster request/response for debugging
LAST_TM = {
    'params': None,
    'status_code': None,
    'response_text': None,
    'timestamp': None,
}


def _haversine_miles(lat1, lon1, lat2, lon2):
    # Calculate great-circle distance between two points (decimal degrees)
    # Returns distance in miles
    try:
        lat1 = float(lat1)
        lon1 = float(lon1)
        lat2 = float(lat2)
        lon2 = float(lon2)
    except Exception:
        return None
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(min(1, math.sqrt(a)))
    miles = 3958.8 * c
    return round(miles, 2)


def _parse_events(raw_events, origin_lat=None, origin_lng=None):
    events = []
    for ev in raw_events:
        venue = None
        city = ''
        venue_location = None
        if ev.get('_embedded', {}).get('venues'):
            v = ev['_embedded']['venues'][0]
            venue = v.get('name')
            city = ', '.join(filter(None, [
                v.get('city', {}).get('name'),
                v.get('state', {}).get('name') if v.get('state') else None,
                v.get('country', {}).get('name') if v.get('country') else None
            ]))
            # include venue coordinates when available
            loc = v.get('location') or {}
            lat_v = loc.get('latitude')
            lon_v = loc.get('longitude')
            if lat_v and lon_v:
                try:
                    venue_location = {'latitude': float(lat_v), 'longitude': float(lon_v)}
                except Exception:
                    venue_location = {'latitude': lat_v, 'longitude': lon_v}
        events.append({
            'id': ev.get('id'),
            'name': ev.get('name'),
            'url': ev.get('url'),
            'date': ev.get('dates', {}).get('start', {}).get('localDate'),
            'time': ev.get('dates', {}).get('start', {}).get('localTime'),
            'venue': venue,
            'city': city,
            'images': ev.get('images', []),
            'venue_location': venue_location,
            'distance_miles': _haversine_miles(origin_lat, origin_lng, venue_location['latitude'], venue_location['longitude']) if (origin_lat and origin_lng and venue_location) else None,
        })
    return events


@bp.route("/recommended", methods=["GET"])
def recommended():
    # example recommended tracks or playlists
    return jsonify({"recommended": [
        {"id": 101, "type": "track", "title": "Discover Track A"},
        {"id": 201, "type": "playlist", "name": "Chill Vibes"}
    ]}), 200


@bp.route("/concerts", methods=["GET"])
def concerts():
    """Proxy to Ticketmaster Discovery API. Expects `lat` and `lng` query params.
    Optional `radius` in miles (default 25). Returns simplified events JSON.
    """
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius', '25')

    if not lat or not lng:
        return jsonify({'error': 'lat and lng query parameters are required'}), 400

    url = 'https://app.ticketmaster.com/discovery/v2/events'
    params = {
        'apikey': TM_API,
        'latlong': f"{lat},{lng}",
        'radius': radius,
        'unit': 'miles',
        'classificationName': 'music',
        'size': 50,
    }

    # Allow caller to force a country code (e.g., ?country=IN) or auto-detect India by bbox
    country = request.args.get('country') or request.args.get('countryCode')
    try:
        latf = float(lat)
        lngf = float(lng)
    except Exception:
        latf = None
        lngf = None

    # India approximate bounding box: lat 6..37, lng 68..97
    if not country and latf is not None and lngf is not None:
        if 6.0 <= latf <= 37.0 and 68.0 <= lngf <= 97.0:
            country = 'IN'

    if country:
        # Ticketmaster expects 'countryCode'
        params['countryCode'] = country.upper()

    try:
        print(f"[discover] Querying Ticketmaster with params: {params}")
        LAST_TM['params'] = dict(params)
        LAST_TM['timestamp'] = datetime.utcnow().isoformat()
        resp = requests.get(url, params=params, timeout=12)

        # store raw response for debugging
        LAST_TM['status_code'] = resp.status_code
        try:
            LAST_TM['response_text'] = resp.text
        except Exception:
            LAST_TM['response_text'] = '<could not read response text>'

        # If Ticketmaster returns non-2xx status, forward useful info for debugging
        if resp.status_code != 200:
            print(f"Ticketmaster API returned status {resp.status_code}: {resp.text}")
            body = None
            try:
                body = resp.json()
            except Exception:
                body = resp.text
            return jsonify({'error': 'Ticketmaster API error', 'status': resp.status_code, 'body': body}), resp.status_code

        data = resp.json()
        raw_events = data.get('_embedded', {}).get('events', [])

        if raw_events:
            events = _parse_events(raw_events, origin_lat=lat, origin_lng=lng)
            if events:
                return jsonify({'events': events}), 200

        # Log raw response for debugging when no events found
        print('Ticketmaster returned no events for initial query. Response body (truncated):')
        try:
            print((LAST_TM.get('response_text') or '')[:2000])
        except Exception:
            print('<could not print response text>')

        # Fallback attempts: broaden the search if initial response had no events
        try:
            # Try larger radius values
            for r in (100, 250):
                params['radius'] = r
                print(f"[discover] Fallback radius={r} params={params}")
                resp = requests.get(url, params=params, timeout=12)
                LAST_TM['params'] = dict(params)
                LAST_TM['status_code'] = resp.status_code
                try:
                    LAST_TM['response_text'] = resp.text
                except Exception:
                    LAST_TM['response_text'] = '<could not read response text>'
                if resp.status_code != 200:
                    continue
                data = resp.json()
                raw_events = data.get('_embedded', {}).get('events', [])
                events = _parse_events(raw_events, origin_lat=lat, origin_lng=lng)
                if events:
                    return jsonify({'events': events, 'note': f'Expanded radius to {r} miles'}), 200

            # Try removing classificationName filter to broaden results
            params.pop('classificationName', None)
            print(f"[discover] Fallback remove classification params={params}")
            resp = requests.get(url, params=params, timeout=12)
            LAST_TM['params'] = dict(params)
            LAST_TM['status_code'] = resp.status_code
            try:
                LAST_TM['response_text'] = resp.text
            except Exception:
                LAST_TM['response_text'] = '<could not read response text>'
            if resp.status_code == 200:
                data = resp.json()
                raw_events = data.get('_embedded', {}).get('events', [])
                events = _parse_events(raw_events, origin_lat=lat, origin_lng=lng)
                if events:
                    return jsonify({'events': events, 'note': 'Removed classification filter to broaden results'}), 200

            # Additional country-specific fallbacks: for India, try searching by city name or keyword
            if country and country.upper() == 'IN':
                try:
                    # 1) Try city search for Dehradun
                    city_params = {
                        'apikey': TM_API,
                        'city': 'Dehradun',
                        'countryCode': 'IN',
                        'size': 50,
                    }
                    print(f"[discover] Fallback city=Dehradun params={city_params}")
                    resp = requests.get(url, params=city_params, timeout=12)
                    LAST_TM['params'] = dict(city_params)
                    LAST_TM['status_code'] = resp.status_code
                    try:
                        LAST_TM['response_text'] = resp.text
                    except Exception:
                        LAST_TM['response_text'] = '<could not read response text>'
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_events = data.get('_embedded', {}).get('events', [])
                        events = _parse_events(raw_events, origin_lat=lat, origin_lng=lng)
                        if events:
                            return jsonify({'events': events, 'note': 'Searched by city=Dehradun'}), 200

                    # 2) Try keyword search 'Dehradun'
                    kw_params = {
                        'apikey': TM_API,
                        'keyword': 'Dehradun',
                        'countryCode': 'IN',
                        'size': 50,
                    }
                    print(f"[discover] Fallback keyword=Dehradun params={kw_params}")
                    resp = requests.get(url, params=kw_params, timeout=12)
                    LAST_TM['params'] = dict(kw_params)
                    LAST_TM['status_code'] = resp.status_code
                    try:
                        LAST_TM['response_text'] = resp.text
                    except Exception:
                        LAST_TM['response_text'] = '<could not read response text>'
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_events = data.get('_embedded', {}).get('events', [])
                        events = _parse_events(raw_events, origin_lat=lat, origin_lng=lng)
                        if events:
                            return jsonify({'events': events, 'note': 'Searched by keyword=Dehradun'}), 200
                except Exception as e3:
                    print('Country-specific fallbacks failed:', e3)
        except Exception as e2:
            print('Fallback Ticketmaster calls failed:', e2)

        # No events found after fallbacks
        return jsonify({'events': []}), 200
    except Exception as e:
        print('Error while calling Ticketmaster:', e)
        return jsonify({'error': 'Failed to fetch events', 'detail': str(e)}), 500


@bp.route('/last_raw', methods=['GET'])
def last_raw():
    """Temporary debug endpoint returning the last Ticketmaster params and truncated response.
    Use ?full=1 to return the full response text (only for local debugging).
    """
    full = request.args.get('full') == '1'
    out = {
        'params': LAST_TM.get('params'),
        'status_code': LAST_TM.get('status_code'),
        'timestamp': LAST_TM.get('timestamp'),
    }
    text = LAST_TM.get('response_text') or ''
    out['response_text'] = text if full else (text[:4000] + ('... (truncated)' if len(text) > 4000 else ''))
    return jsonify(out), 200
