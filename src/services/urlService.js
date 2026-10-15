
const crypto = require('crypto');

const dbPromise = import('../prisma/db.mjs');

async function getDb() {
  const { db } = await dbPromise;
  return db;
}

async function generateUniqueShortCode() {
  const db = await getDb();

  while (true) {
    const candidate = crypto
      .randomBytes(4)
      .toString('base64url')
      .slice(0, 6);

    const existingUrl = await db.orm.public.Url
      .where({ shortCode: candidate })
      .first();

    if (!existingUrl) {
      return candidate;
    }
  }
}

async function createShortUrl(originalUrl) {
  const db = await getDb();

  // Return the existing record if this exact URL was already shortened.
  const existingUrl = await db.orm.public.Url
    .where({ originalUrl })
    .first();

  if (existingUrl) {
    return existingUrl;
  }

  // Generate a code only when the URL is new.
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


async function getAllUrls() {
  const db = await getDb();

  return db.orm.public.Url.all();
}


module.exports = {
  createShortUrl,
  getUrlByShortCode,
  getAllUrls
};
