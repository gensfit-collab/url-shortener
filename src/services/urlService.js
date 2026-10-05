const crypto = require('crypto');

const urls = new Map();

function generateUniqueShortCode() {
  let shortCode;

  do {
    shortCode = crypto.randomBytes(4).toString('base64url').slice(0, 6);
  } while (urls.has(shortCode));

  return shortCode;
}

function createShortUrl(originalUrl) {
  const shortCode = generateUniqueShortCode();

  const urlRecord = {
    originalUrl,
    shortCode,
    createdAt: new Date().toISOString()
  };

  urls.set(shortCode, urlRecord);

  return urlRecord;
}

function getUrlByShortCode(shortCode) {
  return urls.get(shortCode);
}

module.exports = {
  createShortUrl,
  getUrlByShortCode
};