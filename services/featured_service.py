from providers.playback.jiosaavn_provider import JioSaavnProvider


class FeaturedService:

    QUERIES = [
        ("Trending Bollywood", "bollywood trending 2024"),
        ("Punjabi Hits", "punjabi hits diljit karan aujla"),
        ("Arijit Singh", "arijit singh romantic hits"),
        ("90s Classics", "90s hindi classic songs"),
    ]

    @staticmethod
    def get_featured():

        sections = []

        for title, query in FeaturedService.QUERIES:

            tracks = JioSaavnProvider.get_featured_section(query)

            if tracks:
                sections.append({
                    "title": title,
                    "tracks": tracks
                })

        return {
            "sections": sections
        }