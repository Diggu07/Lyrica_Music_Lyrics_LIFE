import requests

SAAVN_BASE = "https://saavn.sumit.co/api"

VERIFIED_SEED = {
    "tamil": "1134651042",       # "Tamil: India Superhits Top 50"
    "malayalam": "1134705865",   # "Malayalam: India Superhits Top 50"
}

LANGUAGES_TO_RESOLVE = ["india", "hindi", "punjabi", "telugu", "bengali", "kannada", "marathi"]

def resolve_playlist(language: str):
    query = f"{language.title()}: India Superhits Top 50" if language != "india" else "India Superhits Top 50"
    try:
        resp = requests.get(f"{SAAVN_BASE}/search", params={"query": query})
        resp.raise_for_status()
        results = resp.json().get("data", {}).get("playlists", {}).get("results", [])
        if not results:
            print(f"[WARN] No playlist found for '{language}' — leave null, do not guess")
            return None
        top = results[0]
        print(f"[CHECK] {language} -> id={top['id']} title='{top['title']}' — verify this matches before using")
        return {"id": top["id"], "title": top["title"]}
    except Exception as e:
        print(f"[ERROR] Failed to resolve '{language}': {e}")
        return None

if __name__ == "__main__":
    output = dict(VERIFIED_SEED)
    for lang in LANGUAGES_TO_RESOLVE:
        result = resolve_playlist(lang)
        if result:
            output[lang] = result["id"]
        else:
            output[lang] = VERIFIED_SEED.get(lang, None)
    print("\nResolved mapping for config/language_charts.json:")
    import json
    print(json.dumps(output, indent=2))
