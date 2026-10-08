const {
  createShortUrl,
  getUrlByShortCode
} = require('../services/urlService');

async function createUrl(req, res, next) {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({
      error: 'originalUrl is required'
    });
  }

  try {
    const urlRecord = await createShortUrl(originalUrl);

    return res.status(201).json({
      originalUrl: urlRecord.originalUrl,
      shortCode: urlRecord.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${urlRecord.shortCode}`,
      createdAt: urlRecord.createdAt
    });
  } catch (error) {
    next(error);
  }
}

async function getUrlInfo(req, res, next) {
  const { shortCode } = req.params;

  try {
    const urlRecord = await getUrlByShortCode(shortCode);

    if (!urlRecord) {
      return res.status(404).json({
        error: 'Short URL not found'
      });
    }

    return res.status(200).json(urlRecord);
  } catch (error) {
    next(error);
  }
}

async function redirectToOriginalUrl(req, res, next) {
  const { shortCode } = req.params;

  try {
    const urlRecord = await getUrlByShortCode(shortCode);

    if (!urlRecord) {
      return res.status(404).json({
        error: 'Short URL not found'
      });
    }

    return res.redirect(urlRecord.originalUrl);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUrl,
  getUrlInfo,
  redirectToOriginalUrl
};