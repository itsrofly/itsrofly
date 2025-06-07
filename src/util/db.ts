import { type Pool } from "pg";

// Accessing Database in Serverfull Architecture
let _db!: Pool | undefined;

export function getDB() {
  if (!_db) {
    throw new Error("No Database");
  }
  return _db;
}

export async function initializeDb(factory: () => Promise<Pool>) {
  if (!_db) {
    _db = await factory();
  }
}

// Database Management
export interface Home {
  id: number;
  descriptions: string;
}

export interface Blog {
  id: number;
  title: string;
  date: string;
  short_description: string;
  content_url: string;
}

export interface Project {
  id: number;
  title: string;
  url: string;
  date: string;
  short_description: string;
  tags_id: string;
  techs: string;
  blog_id: number | null;
}

export interface Tag {
  id: number;
  name: string;
}

export const setupDatabase = async (pool: Pool): Promise<void> => {
  const client = await pool.connect();
  try {
    // Ensure tables exist. SERIAL is PostgreSQL's equivalent for AUTOINCREMENT.
    // TIMESTAMP is generally preferred over DATETIME in PostgreSQL.
    await client.query(`
      CREATE TABLE home (
          id SERIAL PRIMARY KEY,
          descriptions TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tags (
          id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS blogs (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          short_description TEXT,
          content_url TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          short_description TEXT,
          tags_id TEXT,  -- Comma-separated tag IDs
          techs TEXT,    -- Comma-separated base64 strings
          blog_id INTEGER,
          FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE SET NULL
      );
    `);
  } finally {
    client.release();
  }
};

export const getBlog = async (id: string): Promise<Blog | null> => {
  const pool = getDB();
  const client = await pool.connect();
  try {
    const result = await client.query<Blog>(
      "SELECT * FROM Blogs WHERE ID = $1",
      [id],
    );
    console.log(result.rows[0]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const getBlogs = async (limit: number = 0): Promise<Blog[]> => {
  const pool = getDB();
  const client = await pool.connect();
  try {
    let query = "SELECT * FROM Blogs ORDER BY Date DESC";
    const queryParams: any[] = [];

    if (limit > 0) {
      query += ` LIMIT $1`;
      queryParams.push(limit);
    }

    const result = await client.query<Blog>(query, queryParams);
    console.log(result.rows);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getTags = async (): Promise<Tag[]> => {
  const pool = getDB();
  const client = await pool.connect();
  try {
    const result = await client.query<Tag>("SELECT * FROM Tags");
    return result.rows;
  } finally {
    client.release();
  }
};

export const getProjects = async (tagId: number = -1): Promise<Project[]> => {
  const pool = getDB();
  const client = await pool.connect();
  try {
    let query = "SELECT * FROM Projects";
    const params: any[] = [];

    if (tagId > -1) {
      // This condition ensures that the tagId is matched as a whole word within the comma-separated string.
      // e.g., tag '1' in '1,10,2' will match '1', not '10'.
      query += ` WHERE ',' || Tags_ID || ',' LIKE $1`;
      params.push(`%,${tagId},%`);
    }

    query += " ORDER BY Date DESC";

    const result = await client.query<Project>(query, params);
    return result.rows;
  } finally {
    client.release();
  }
};
