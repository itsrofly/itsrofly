import { type Pool } from "pg";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Accessing Database in Serverfull Architecture
let _db!: Pool | undefined;
const TOKEN_EXPIRES_IN_MINUTES = 10;

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

export interface Tokens {
  id: number;
  token: string;
  expires_at: string;
}

export const setupDatabase = async (pool: Pool): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS home (
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

      CREATE ROLE supabase_admin WITH LOGIN SUPERUSER;
      CREATE EXTENSION IF NOT EXISTS pg_cron;
      DO $$
      BEGIN
        -- 1. Create 'tokens' table if it doesn't exist
        IF NOT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'tokens'
        ) THEN
          CREATE TABLE tokens (
            id SERIAL PRIMARY KEY,
            token TEXT NOT NULL,
            expires_at TIMESTAMPTZ NOT NULL
          );
        END IF;

        -- 2. Create cron job only if it doesn't already exist
        IF NOT EXISTS (
          SELECT 1 FROM cron.job WHERE jobname = 'delete_expired_tokens'
        ) THEN
          PERFORM cron.schedule(
            'delete_expired_tokens',
            '*/5 * * * *',
            $_$ DELETE FROM tokens WHERE expires_at < NOW(); $_$
          );
        END IF;
      END
      $$;

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

export async function generateToken(email: string): Promise<string> {
  // 1. Generate a random secret for this token
  const jwtSecret = crypto.randomBytes(32).toString("hex");

  // 2. Create JWT with 10-minute expiration
  const token = jwt.sign({ email }, jwtSecret, {
    expiresIn: `${TOKEN_EXPIRES_IN_MINUTES}m`,
  });

  // 3. Calculate expiration timestamp
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);
  const pool = getDB();
  const client = await pool.connect();
  try {
    // 4. Insert token and expiration time into DB
    await client.query(
      `INSERT INTO tokens (token, expires_at) VALUES ($1, $2)`,
      [token, expiresAt],
    );

    return token;
  } catch (err) {
    console.error("Error saving JWT to database:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function verifyToken(token: string): Promise<boolean> {
  const pool = getDB();
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 1 FROM tokens WHERE token = $1 AND expires_at > NOW() LIMIT 1`,
      [token],
    );

    return !!result.rowCount && result.rowCount > 0;
  } catch (err) {
    console.error("Error verifying token:", err);
    return false;
  } finally {
    client.release();
  }
}
