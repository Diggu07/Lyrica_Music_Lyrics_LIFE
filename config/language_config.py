import json
import os

CONFIG_PATH = os.path.join(
    os.path.dirname(__file__),
    "language_charts.json"
)


class LanguageConfig:

    @staticmethod
    def get(language):

        if not os.path.exists(CONFIG_PATH):
            return None

        with open(CONFIG_PATH, encoding="utf8") as f:
            return json.load(f).get(language)

    @staticmethod
    def get_active_languages():

        if not os.path.exists(CONFIG_PATH):
            return []

        with open(CONFIG_PATH, encoding="utf8") as f:
            cfg = json.load(f)

        return [
            lang
            for lang, playlist in cfg.items()
            if playlist
        ]