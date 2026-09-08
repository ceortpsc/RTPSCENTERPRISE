import sqlite3
from pathlib import Path

SCHEMA = Path(__file__).with_name("schema.sql")

def connect(path: str) -> sqlite3.Connection:
    db = sqlite3.connect(path)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    db.execute("PRAGMA journal_mode=WAL")
    return db

def init(path: str) -> None:
    with connect(path) as db:
        db.executescript(SCHEMA.read_text())
