/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");

  await prisma.category.deleteMany();
  console.timeEnd("🧹 Cleaned up the database...");

  const totalCategories = 100;
  console.time(`👤 Created ${totalCategories} categories...`);

  for (let index = 0; index < totalCategories; index++) {
    const categoryName = faker.commerce.department() + "-" + index;
    await prisma.category
      .create({
        select: { id: true },
        data: {
          name: categoryName,
        },
      })
      .catch((e) => {
        console.error("Error creating a user:", e);
        return null;
      });
  }
  console.timeEnd(`👤 Created ${totalCategories} categories...`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
