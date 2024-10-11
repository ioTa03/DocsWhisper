import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });
export default defineConfig( {
    dialect: "postgresql",
    schema: "./src/lib/db/schema.ts", // Path to your schema file
    dbCredentials: {
    url:  process.env.DATABASE_URL!, // Use the validated connection string
  },
});
// npx drizzle-kit push
// Command to push migrations to PostgreSQL
// npx drizzle-kit push:pg
