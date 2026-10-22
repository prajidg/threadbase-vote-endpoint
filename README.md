# Threadbase Vote Endpoint

Express, Prisma 7, and PostgreSQL voting API.

## Features
- POST /posts/:id/vote
- Atomic score increment
- Transactional vote creation
- Duplicate-vote prevention
- HTTP error handling: 400, 404, 409

## Run locally
1. Configure DATABASE_URL in .env.
2. Run npm install.
3. Run npx prisma migrate dev.
4. Run npx prisma generate.
5. Run npx tsx scripts/seed.ts.
6. Run npx tsx src/app.ts.

Authentication is stubbed for local testing.
