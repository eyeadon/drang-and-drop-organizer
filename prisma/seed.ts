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
          content: "Alice Task 1",
          group: "A",
        },
        {
          content: "Alice Task 2",
          group: "A",
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
          content: "Bob Task 1",
          group: "B",
        },
        {
          content: "Bob Task 2",
          group: "B",
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
