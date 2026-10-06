afterAll(async () => {
  const { db } = await import('../src/prisma/db.mjs');

  await db.close();
});