const request = require('supertest');
const app = require('../src/app');

describe('URL Shortener API', () => {
  let shortCode;

  test('POST /api/urls should create a short URL', async () => {
    const response = await request(app)
      .post('/api/urls')
      .send({
        originalUrl: 'https://www.google.com'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.originalUrl).toBe('https://www.google.com');
    expect(response.body.shortCode).toBeDefined();
    expect(response.body.shortUrl).toContain(response.body.shortCode);
    expect(response.body.createdAt).toBeDefined();

    shortCode = response.body.shortCode;
  });

  test('POST /api/urls should reject a missing originalUrl', async () => {
    const response = await request(app)
      .post('/api/urls')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('originalUrl is required');
  });

  test('POST /api/urls should reject an invalid URL', async () => {
    const response = await request(app)
      .post('/api/urls')
      .send({
        originalUrl: 'not-a-valid-url'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid URL');
  });

  test('POST /api/urls should reject unsupported protocols', async () => {
    const response = await request(app)
      .post('/api/urls')
      .send({
        originalUrl: 'ftp://example.com/file.txt'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('URL must use http or https');
  });

  test('GET /api/urls/:shortCode should return URL information', async () => {
    const response = await request(app)
      .get(`/api/urls/${shortCode}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.originalUrl).toBe('https://www.google.com');
    expect(response.body.shortCode).toBe(shortCode);
    expect(response.body.createdAt).toBeDefined();
  });

  test('GET /api/urls/:shortCode should return 404 for an unknown short code', async () => {
    const response = await request(app)
      .get('/api/urls/unknown123');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Short URL not found');
  });

  test('GET /:shortCode should redirect to the original URL', async () => {
    const response = await request(app)
      .get(`/${shortCode}`)
      .redirects(0);

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('https://www.google.com');
  });

  test('GET /:shortCode should return 404 for an unknown short code', async () => {
    const response = await request(app)
      .get('/unknown123')
      .redirects(0);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Short URL not found');
  });
});