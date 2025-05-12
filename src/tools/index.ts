import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const getData = async () => {
    const db = await open({
        filename: 'storage/database.db',
        driver: sqlite3.Database
      })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS Tags (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Blogs (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title TEXT NOT NULL,
        Date DATETIME DEFAULT CURRENT_TIMESTAMP,
        Description TEXT,
        Content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Projects (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title TEXT NOT NULL,
        Date DATETIME DEFAULT CURRENT_TIMESTAMP,
        Description TEXT,
        Tags_ID TEXT,  -- Comma-separated tag IDs
        Techs TEXT,    -- Comma-separated base64 strings
        Blog_ID INTEGER,
        FOREIGN KEY (Blog_ID) REFERENCES Blogs(ID) ON DELETE SET NULL
    );
    `)
    const data = {
        "Projects": await db.get("SELECT * FROM Projects"),
        "Blogs": await db.get("SELECT * FROM Blogs"),
        "Tags": await db.get("SELECT * FROM Tags")
    }

    db.close()
    return data
}