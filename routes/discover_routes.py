from flask import Blueprint, render_template
import sqlite3, os

# Blueprint definition (tell Flask to look for HTML in frontend/)
discover_bp = Blueprint(
    "discover", __name__,
    template_folder="../frontend"  # 👈 this fixes "template not found"
)

# Path to SQLite database
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "content.db")

@discover_bp.route("/discover")
def discover():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT title, publisher, url FROM podcasts ORDER BY id DESC LIMIT 5")
    podcasts = cur.fetchall()
    cur.execute("SELECT title, source, url FROM news ORDER BY id DESC LIMIT 5")
    news = cur.fetchall()
    cur.execute("SELECT name, venue, date, url FROM concerts ORDER BY id DESC LIMIT 5")
    concerts = cur.fetchall()
    conn.close()

    return render_template(
        "discover.html",
        podcasts=podcasts,
        news=news,
        concerts=concerts
    )
