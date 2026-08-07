/**
 * Seeds the database on first deploy, and only on first deploy.
 *
 * A hosted deploy has no terminal step, so a brand-new site would otherwise
 * come up with an empty catalog and no way to sign in. This runs during the
 * build and seeds *only when the database has no users in it*.
 *
 * The check is deliberately conservative. `npm run db:seed` clears every table
 * before it runs — correct for a demo database, catastrophic on a deploy hook
 * once real learners exist. So the moment there is a single user, this becomes
 * a no-op and stays one forever.
 *
 * Set SKIP_DB_BOOTSTRAP=1 to disable it entirely, or SEED_ON_DEPLOY=0 to build
 * a deployment that never seeds.
 */

import { execFileSync } from "node:child_process";

import { prisma } from "../src/lib/prisma";

async function main() {
  if (process.env.SKIP_DB_BOOTSTRAP === "1" || process.env.SEED_ON_DEPLOY === "0") {
    console.log("Database bootstrap disabled by environment. Skipping.");
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL set — skipping bootstrap. The app will not start without one.");
    return;
  }

  let userCount: number;
  try {
    userCount = await prisma.user.count();
  } catch (error) {
    // Almost always "the tables do not exist yet", which means `prisma db push`
    // has not run. Fail loudly: a site deployed against an unmigrated database
    // would 500 on every page, and that is much harder to diagnose later.
    console.error(
      "\nCould not read from the database. Has `prisma db push` run against DATABASE_URL?\n",
    );
    throw error;
  }

  if (userCount > 0) {
    console.log(
      `Database already has ${userCount} users — leaving it alone. ` +
        "Seeding would delete them.",
    );
    return;
  }

  console.log("Empty database detected. Seeding the demo academy…\n");

  // Run the seed as its own process rather than importing it: seed.ts is a
  // script that runs on import and disconnects when it finishes, so importing
  // it here would tear down the client this process is still holding.
  execFileSync("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "inherit",
    cwd: new URL("..", import.meta.url).pathname,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
