import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "db",
  user: process.env.POSTGRES_USER || "user",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "samgov",
});

/**
 * Check if tables exist and run migrations if necessary
 */
const runMigrations = async () => {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users');"
  );

  if (!result.rows[0].exists) {
    console.log("🔧 Running DB migrations...");

    const migrationPath = path.join(__dirname, "migrations/init.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    await pool.query(migrationSQL);
    console.log("✅ Database initialized!");
  } else {
    console.log("🗄️ Database already set up.");
  }
};

runMigrations();

export { pool };
