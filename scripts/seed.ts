import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "Test User" },
  });

  const count = await prisma.post.count();
  const missing = Math.max(0, 2 - count);

  if (missing > 0) {
    await prisma.post.createMany({
      data: Array.from({ length: missing }, (_, i) => ({
        title: `Test Post ${count + i + 1}`,
        body: "A sample post for voting tests.",
      })),
    });
  }

  console.log("User ID 1 is ready.");
  console.log(await prisma.post.findMany({
    select: { id: true, title: true, score: true },
  }));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
