const {
  createShortUrl,
  getUrlByShortCode
} = require('../services/urlService');

function createUrl(req, res) {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({
      error: 'originalUrl is required'
    });
  }

  try {
    const urlRecord = createShortUrl(originalUrl);

    return res.status(201).json({
      originalUrl: urlRecord.originalUrl,
      shortCode: urlRecord.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${urlRecord.shortCode}`,
      createdAt: urlRecord.createdAt
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to create short URL'
    });
  }
}

function getUrlInfo(req, res) {
  const { shortCode } = req.params;
  const urlRecord = getUrlByShortCode(shortCode);

  if (!urlRecord) {
    return res.status(404).json({
      error: 'Short URL not found'
    });
  }

  return res.status(200).json(urlRecord);
}

function redirectToOriginalUrl(req, res) {
  const { shortCode } = req.params;
  const urlRecord = getUrlByShortCode(shortCode);

  if (!urlRecord) {
    return res.status(404).json({
      error: 'Short URL not found'
    });
  }

  return res.redirect(urlRecord.originalUrl);
}

module.exports = {
  createUrl,
  getUrlInfo,
  redirectToOriginalUrl
};