const express = require('express');

const {
  createUrl,
  getUrlInfo
} = require('../controllers/urlController');

const validateUrl = require('../middleware/validateUrl');

const router = express.Router();

router.post('/', validateUrl, createUrl);
router.get('/:shortCode', getUrlInfo);

module.exports = router;