import { defineConfig } from "drizzle-kit";
import {config} from "dotenv";
import * as path from "path";

// Explicitly load .env.local
config({ path: ".env.local" });

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});