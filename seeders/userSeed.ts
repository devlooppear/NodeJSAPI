import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken'; 

const prisma = new PrismaClient();
const JWT_SECRET = 'API_Web_Token';

async function seedUsers() {
  try {
    // Generate fake users
    const fakeUsers = Array.from({ length: 18 }).map(() => ({
      name: faker.internet.userName(),
      email: faker.internet.email(),
    }));

    // Create users and generate access tokens
    await Promise.all(fakeUsers.map(async (user) => {
      const newUser = await prisma.user.create({ data: user });
      
      // Generate a JWT for the access token
      const accessToken = jwt.sign({ user_id: newUser.id }, JWT_SECRET);

      // Create a personal access token for the user
      await prisma.personalAccessToken.create({
        data: {
          token: accessToken,
          user: { connect: { id: newUser.id } }, // Associate the token with the user
        },
      });
    }));

    console.log('Users seeded successfully with access tokens.');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
