import { Pool } from "pg";
import { initializeDb, setupDatabase } from "~/util/db";
import { type RequestHandler } from "@builder.io/qwik-city";

// Accessing Database in Serverfull Architecture
export const onRequest: RequestHandler = async ({ env }) => {
  const port: number = env.get("PRIVATE_PG_PORT")! as unknown as number;
  await initializeDb(async () => {
    const pool = new Pool({
      user: env.get("PRIVATE_PG_USER")!,
      host: env.get("PRIVATE_PG_HOST")!,
      database: env.get("PRIVATE_PG_DATABASE")!,
      password: env.get("PRIVATE_PG_PASSWORD")!,
      port: port || 5432,
    });
    // Setup Database
    await setupDatabase(pool);
    return pool;
  });
};
