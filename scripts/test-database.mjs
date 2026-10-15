// Applies every migration to an in-process Postgres (PGlite) that mimics the
// parts of Supabase the migrations rely on, then runs the SQL tests in
// supabase/tests. Run with `npm run test:db`.
//
// Hosted-only extensions (pg_cron, pg_net) are skipped; everything else runs
// as written, so a broken migration or a failing test stops the script.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

const MIGRATIONS = "supabase/migrations";
const TESTS = "supabase/tests";

const SUPABASE_BASELINE = `
  CREATE ROLE anon NOLOGIN;
  CREATE ROLE authenticated NOLOGIN;
  CREATE ROLE service_role NOLOGIN BYPASSRLS;
  CREATE SCHEMA extensions;
  CREATE EXTENSION pgcrypto WITH SCHEMA extensions;
  GRANT USAGE ON SCHEMA public, extensions TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
  CREATE SCHEMA storage;
  CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  CREATE SCHEMA cron;
  CREATE FUNCTION cron.unschedule(job_name text) RETURNS boolean LANGUAGE sql AS 'SELECT true';
`;

/** Drop statements that need extensions only the hosted platform provides. */
function hostedOnly(statement) {
  return /CREATE EXTENSION IF NOT EXISTS (pg_cron|pg_net)/i.test(statement) || /SELECT cron\.unschedule/i.test(statement);
}

function withoutHostedOnly(sql) {
  return sql
    .split(/\n/)
    .filter((line) => !hostedOnly(line))
    .join("\n");
}

const db = new PGlite({ extensions: { pgcrypto } });
await db.exec(SUPABASE_BASELINE);

const migrations = (await readdir(MIGRATIONS)).filter((name) => name.endsWith(".sql")).sort();
for (const name of migrations) {
  try {
    await db.exec(withoutHostedOnly(await readFile(join(MIGRATIONS, name), "utf8")));
    console.log(`migration ok   ${name}`);
  } catch (error) {
    console.error(`migration FAIL ${name}\n  ${error.message}`);
    process.exit(1);
  }
}

// The admin password is provisioned outside the repository in production.
await db.exec(`INSERT INTO cms_private.credentials(password_hash) VALUES (extensions.crypt('provisioned-outside-repo', extensions.gen_salt('bf', 4)));`);

let failed = 0;
for (const name of (await readdir(TESTS)).filter((file) => file.endsWith(".sql")).sort()) {
  try {
    await db.exec(await readFile(join(TESTS, name), "utf8"));
    console.log(`test ok        ${name}`);
  } catch (error) {
    failed++;
    console.error(`test FAIL      ${name}\n  ${error.message}`);
    await db.exec("ROLLBACK").catch(() => {});
  }
}
await db.close();
if (failed) process.exit(1);
