const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'supersecurepassword',
    },
  });

  console.log('Created user:', user);

  // Fetch all users
  const users = await prisma.user.findMany();
  console.log('All users:', users);
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

