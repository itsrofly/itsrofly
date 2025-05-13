import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export interface Blog {
    ID: number
    Title: string
    Date: string
    Short_Description: string
    Content_URL: string
}

export interface Project {
    ID: number
    Title: string
    URL: string
    Date: string
    Short_Description: string
    Tags_ID: string // Comma-separated tag IDs
    Techs: string // Comma-separated base64 strings
    Blog_ID: number | null
}
export interface Tag {
    ID: number
    Name: string
}

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
        Short_Description TEXT,
        Content_URL TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Projects (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title TEXT NOT NULL,
        URL TEXT NOT NULL,
        Date DATETIME DEFAULT CURRENT_TIMESTAMP,
        Short_Description TEXT,
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

export const getBlog = async (id: string): Promise<Blog | null> => {
    const db = await open({
        filename: 'storage/database.db',
        driver: sqlite3.Database
      })

    const blog = await db.get("SELECT * FROM Blogs WHERE ID = ?", id)
    db.close()
    return blog
}

export const getBlogs = async (limit: number = 0): Promise<Blog[]> => {
    const db = await open({
        filename: 'storage/database.db',
        driver: sqlite3.Database
      })
    
    const limitQuery = limit > 0 ? `LIMIT ${limit}` : ''
    // Get blogs order by the latest date
    const blogs = await db.all(`SELECT * FROM Blogs ORDER BY Date DESC ${limitQuery}`)
    db.close()
    return blogs
}

export const getTags = async (): Promise<Tag[]> => {
    const db = await open({
        filename: 'storage/database.db',
        driver: sqlite3.Database
      })

    // Get all tags
    const tags = await db.all("SELECT * FROM Tags")
    db.close()
    return tags
}

export const getProjects = async (tag: number = -1): Promise<Project[]> => {
    const db = await open({
        filename: 'storage/database.db',
        driver: sqlite3.Database
      })

    const filterQuery = tag > -1 ? `WHERE ',' || Tags_ID || ',' LIKE '%,${tag},%'` : ''
    // Get projects order by the latest date
    const projects = await db.all(`SELECT * FROM Projects ${filterQuery} ORDER BY Date DESC`)
    db.close()
    return projects
}