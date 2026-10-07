function validateUrl(req, res, next) {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({
      error: 'originalUrl is required'
    });
  }

  try {
    const parsedUrl = new URL(originalUrl);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        error: 'URL must use http or https'
      });
    }

    next();
  } catch {
    return res.status(400).json({
      error: 'Invalid URL'
    });
  }
}

module.exports = validateUrl;
