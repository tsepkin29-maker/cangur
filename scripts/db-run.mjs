/**
 * Run a .sql file (or inline SQL) against the linked Supabase project
 * through the Management API. No Docker / psql needed.
 *
 *   node scripts/db-run.mjs supabase/migrations/0001_init.sql
 *   node scripts/db-run.mjs --sql "select 1"
 */
import fs from "node:fs";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF;
if (!token || !ref) {
  console.error("Set SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF (.env.local)");
  process.exit(1);
}

const arg = process.argv[2];
let query;
if (arg === "--sql") query = process.argv[3];
else if (arg) query = fs.readFileSync(arg, "utf8");
else {
  console.error("usage: node scripts/db-run.mjs <file.sql | --sql \"...\">");
  process.exit(1);
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  },
);

const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  console.error(text);
  process.exit(1);
}
let json;
try {
  json = JSON.parse(text);
} catch {
  console.log(text);
  process.exit(0);
}
console.log(JSON.stringify(json, null, 2));
