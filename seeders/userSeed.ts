import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Generate fake users
    const fakeUsers = Array.from({ length: 18 }).map(() => ({
      name: faker.internet.userName(),
      email: faker.internet.email(),
    }));

    // Create users
    await prisma.user.createMany({
      data: fakeUsers,
    });

    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
