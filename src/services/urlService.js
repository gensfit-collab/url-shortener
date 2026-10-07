const crypto = require('crypto');

const dbPromise = import('../prisma/db.mjs');

async function getDb() {
  const { db } = await dbPromise;
  return db;
}

async function generateUniqueShortCode() {
  const db = await getDb();

  let shortCode;

  while (!shortCode) {
    const candidate = crypto.randomBytes(4).toString('base64url').slice(0, 6);

    const existingUrl = await db.orm.public.Url
      .where({ shortCode: candidate })
      .first();

    if (!existingUrl) {
      shortCode = candidate;
    }
  }

  return shortCode;
}

async function createShortUrl(originalUrl) {
  const db = await getDb();
  const shortCode = await generateUniqueShortCode();

  return db.orm.public.Url.create({
    originalUrl,
    shortCode
  });
}

async function getUrlByShortCode(shortCode) {
  const db = await getDb();

  return db.orm.public.Url
    .where({ shortCode })
    .first();
}

module.exports = {
  createShortUrl,
  getUrlByShortCode
};
