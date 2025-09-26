import { config } from "dotenv";
config({ path: ".env.local" });
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

async function main() {
  console.log("Running migrations...");

  const migrationPool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
  });

  const db = drizzle(migrationPool);

  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("Migrations completed successfully");

  await migrationPool.end();
  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
