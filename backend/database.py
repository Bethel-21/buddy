

import sqlite3

DB_NAME = "database.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Pomodoro sessions table
    c.execute("""
        CREATE TABLE IF NOT EXISTS pomodoro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT,
            duration INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Quiz scores table
    c.execute("""
        CREATE TABLE IF NOT EXISTS quiz_score (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT,
            score INTEGER,
            total INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()

# Initialize DB when module is imported
init_db()
