const express = require('express');
const path = require('path');

const urlRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'url-shortener-api'
  });
});

app.use('/api/urls', urlRoutes);
app.use('/', redirectRoutes);

app.use(errorHandler);

module.exports = app;