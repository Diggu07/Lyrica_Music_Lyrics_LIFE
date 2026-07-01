from datetime import datetime, timedelta, timezone

from repositories.base_repository import BaseRepository


class ChartRepository(BaseRepository):

    collection_name = "charts"

    @classmethod
    def get_chart(
        cls,
        chart_type,
        language=None
    ):

        return cls.find_one({

            "chartType": chart_type,

            "language": language

        })

    @classmethod
    def save_chart(
        cls,
        chart_type,
        language,
        source,
        tracks
    ):

        cls.upsert(

            {

                "chartType": chart_type,

                "language": language

            },

            {

                "chartType": chart_type,

                "language": language,

                "source": source,

                "tracks": tracks,

                "lastUpdated": datetime.now(
                    timezone.utc
                )

            }

        )

    @classmethod
    def delete_chart(
        cls,
        chart_type,
        language=None
    ):

        return cls.delete_one({

            "chartType": chart_type,

            "language": language

        })

    @classmethod
    def get_all(
        cls
    ):

        return cls.find({})

    @classmethod
    def exists(
        cls,
        chart_type,
        language=None
    ):

        return super().exists({

            "chartType": chart_type,

            "language": language

        })

    @staticmethod
    def is_cache_fresh(
        chart_doc,
        hours
    ):

        if not chart_doc:
            return False

        last = chart_doc.get(
            "lastUpdated"
        )

        if not last:
            return False

        if last.tzinfo:

            last = last.astimezone(
                timezone.utc
            ).replace(
                tzinfo=None
            )

        return (

            datetime.utcnow() - last

        ) < timedelta(
            hours=hours
        )
    
    # ---------------------------------------------------------
    # Trending Songs
    # ---------------------------------------------------------
    
    @classmethod
    def get_trending_songs(
        cls,
        language=None,
        limit=100
    ):
    
        chart = cls.get_chart(
            chart_type="trending",
            language=language
        )
    
        if not chart:
            return []
    
        return chart.get(
            "tracks",
            []
        )[:limit]