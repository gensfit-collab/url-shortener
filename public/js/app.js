const form = document.getElementById('url-form');
const originalUrlInput = document.getElementById('original-url');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const buttonLoader = document.getElementById('button-loader');

const urlError = document.getElementById('url-error');
const apiError = document.getElementById('api-error');

const resultSection = document.getElementById('result-section');
const shortUrl = document.getElementById('short-url');
const copyButton = document.getElementById('copy-button');
const copyMessage = document.getElementById('copy-message');

function showMessage(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function hideMessage(element) {
  element.textContent = '';
  element.hidden = true;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  buttonText.hidden = isLoading;
  buttonLoader.hidden = !isLoading;
}

function hideResult() {
  resultSection.hidden = true;
  shortUrl.textContent = '';
  shortUrl.href = '#';
  hideMessage(copyMessage);
}

function validateUrl(value) {
  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Please enter a URL starting with http:// or https://.';
    }

    return '';
  } catch {
    return 'Please enter a valid URL.';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  hideMessage(urlError);
  hideMessage(apiError);
  hideMessage(copyMessage);
  hideResult();

  const originalUrl = originalUrlInput.value.trim();

  if (!originalUrl) {
    showMessage(urlError, 'Please enter a URL.');
    originalUrlInput.focus();
    return;
  }

  const validationError = validateUrl(originalUrl);

  if (validationError) {
    showMessage(urlError, validationError);
    originalUrlInput.focus();
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ originalUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to shorten the URL.');
    }

    shortUrl.textContent = data.shortUrl;
    shortUrl.href = data.shortUrl;

    resultSection.hidden = false;
  } catch (error) {
    showMessage(
      apiError,
      error.message || 'Something went wrong. Please try again.'
    );
  } finally {
    setLoading(false);
  }
});

copyButton.addEventListener('click', async () => {
  const url = shortUrl.href;

  if (!url || url === '#') {
    return;
  }

  try {
    await navigator.clipboard.writeText(url);

    showMessage(copyMessage, 'URL copied to clipboard.');

    setTimeout(() => {
      hideMessage(copyMessage);
    }, 2500);
  } catch {
    showMessage(
      copyMessage,
      'Unable to copy automatically. Please copy the URL manually.'
    );
  }
});