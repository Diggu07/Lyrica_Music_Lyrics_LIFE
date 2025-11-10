import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "database", "content.db")

# make sure the database folder exists
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.executescript("""
CREATE TABLE IF NOT EXISTS podcasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    publisher TEXT,
    url TEXT,
    fetched_at TEXT
);
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    source TEXT,
    url TEXT,
    fetched_at TEXT
);
CREATE TABLE IF NOT EXISTS concerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    venue TEXT,
    date TEXT,
    url TEXT,
    fetched_at TEXT
);
""")

conn.commit()
conn.close()
print("✅ Tables created successfully in", DB_PATH)
