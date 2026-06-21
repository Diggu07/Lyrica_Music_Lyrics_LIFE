# Fetcher README

This project uses MongoDB for storage. The fetcher script `api/api_fetcher.py` fetches songs from YouTube and concerts from Ticketmaster, storing results in MongoDB collections `songs` and `concerts`.

## Requirements
- A running MongoDB instance (local or remote).
- Environment variables set:
  - `MONGO_URI` (optional, defaults to `mongodb://localhost:27017/`)
  - `DB_NAME` (optional, defaults to `lyrica_music`)
  - `YOUTUBE_API_KEY` (required to fetch YouTube data)
  - `TICKETMASTER_API_KEY` (required to fetch Ticketmaster events)

## Install dependencies
Use the project's `requirements.txt`:

```powershell
python -m pip install -r requirements.txt
```

## Run the fetcher
From the project root:

```powershell
python -m api.api_fetcher
```

The script will upsert documents into the `songs` and `concerts` collections. If API keys are missing or the MongoDB instance is inaccessible, the script will print errors.

## Notes
- The project now uses MongoDB for persistence across the app; SQLite files and helpers have been removed.
- If you want scheduled runs, run this script from a cron/scheduler or wrap it in a service.
