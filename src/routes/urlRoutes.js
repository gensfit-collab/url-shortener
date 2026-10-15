
const express = require('express');

const {
  createUrl,
  getUrlInfo,
  listUrls
} = require('../controllers/urlController');

const validateUrl = require('../middleware/validateUrl');

const router = express.Router();

// Create a new short URL
router.post('/', validateUrl, createUrl);

// Get all saved URLs
router.get('/', listUrls);

// Get details for a specific short code
router.get('/:shortCode', getUrlInfo);

module.exports = router;
