import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    tasks: {
      create: [
        {
          content: "Task 1",
        },
        {
          content: "Task 2",
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    tasks: {
      create: [
        {
          content: "Task 1",
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
