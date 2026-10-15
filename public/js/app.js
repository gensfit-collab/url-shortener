
'use strict';

// ==========================================
// DOM ELEMENTS
// ==========================================

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

const totalLinksElement = document.getElementById('total-links');
const todayLinksElement = document.getElementById('today-links');
const linksCountElement = document.getElementById('links-count');
const linksList = document.getElementById('links-list');
const emptyLinks = document.getElementById('empty-links');
const tableSummary = document.getElementById('table-summary');
const linkSearch = document.getElementById('link-search');
const footerYear = document.getElementById('footer-year');

let savedLinks = [];

// ==========================================
// MESSAGE AND LOADING HELPERS
// ==========================================

function showMessage(element, message) {
  if (!element) return;

  element.textContent = message;
  element.hidden = false;
}

function hideMessage(element) {
  if (!element) return;

  element.textContent = '';
  element.hidden = true;
}

function setLoading(isLoading) {
  if (submitButton) {
    submitButton.disabled = isLoading;
    submitButton.setAttribute('aria-busy', String(isLoading));
  }

  if (buttonText) buttonText.hidden = isLoading;
  if (buttonLoader) buttonLoader.hidden = !isLoading;
}

function hideResult() {
  if (resultSection) resultSection.hidden = true;

  if (shortUrl) {
    shortUrl.textContent = '';
    shortUrl.href = '#';
  }

  hideMessage(copyMessage);
}

// ==========================================
// URL VALIDATION
// ==========================================

function validateUrl(value) {
  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Please enter a URL starting with http:// or https://.';
    }

    if (!url.hostname || !url.hostname.includes('.')) {
      return 'Please enter a valid website address.';
    }

    return '';
  } catch {
    return 'Please enter a valid URL, including https://.';
  }
}

// ==========================================
// FORMATTING HELPERS
// ==========================================

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function createCell(value, className = '') {
  const cell = document.createElement('td');
  cell.textContent = value == null ? '' : String(value);

  if (className) {
    cell.className = className;
  }

  return cell;
}

// ==========================================
// RENDER SAVED LINKS
// ==========================================

function renderLinks(links = savedLinks) {
  if (!linksList) return;

  if (!Array.isArray(links)) {
    console.error('Expected an array of links but received:', links);
    links = [];
  }

  linksList.replaceChildren();

  if (linksCountElement) {
    linksCountElement.textContent = String(links.length);
  }

  if (emptyLinks) {
    emptyLinks.hidden = links.length > 0;
  }

  if (tableSummary) {
    if (links.length > 0) {
      tableSummary.textContent =
        'Showing ' + links.length + ' link' +
        (links.length === 1 ? '' : 's');
    } else {
      tableSummary.textContent = 'No links to display';
    }
  }

  links.forEach((link) => {
    if (!link || !link.shortCode || !link.originalUrl) {
      console.warn('Skipping an incomplete link record:', link);
      return;
    }

    const row = document.createElement('tr');

    // Original URL
    const originalCell = createCell(
      link.originalUrl,
      'original-url-cell'
    );
    originalCell.title = link.originalUrl;

    // Short code
    const codeCell = document.createElement('td');
    const codeLink = document.createElement('a');

    codeLink.href = '/' + encodeURIComponent(link.shortCode);
    codeLink.textContent = link.shortCode;
    codeLink.className = 'short-code-link';

    codeCell.appendChild(codeLink);

    // Creation date
    const dateCell = createCell(formatDate(link.createdAt));

    // Actions
    const actionsCell = document.createElement('td');
    actionsCell.className = 'link-actions';

    const copyLinkButton = document.createElement('button');
    copyLinkButton.type = 'button';
    copyLinkButton.textContent = 'Copy';
    copyLinkButton.className = 'copy-link-button';

    copyLinkButton.addEventListener('click', async () => {
      const fullShortUrl = new URL(
        '/' + encodeURIComponent(link.shortCode),
        window.location.origin
      ).href;

      try {
        await navigator.clipboard.writeText(fullShortUrl);

        copyLinkButton.textContent = 'Copied!';

        window.setTimeout(() => {
          copyLinkButton.textContent = 'Copy';
        }, 1500);
      } catch {
        window.prompt('Copy your short link:', fullShortUrl);
      }
    });

    actionsCell.appendChild(copyLinkButton);

    row.append(
      originalCell,
      codeCell,
      dateCell,
      actionsCell
    );

    linksList.appendChild(row);
  });
}

// ==========================================
// DASHBOARD METRICS
// ==========================================

function updateMetrics(links) {
  if (!Array.isArray(links)) return;

  if (totalLinksElement) {
    totalLinksElement.textContent = String(links.length);
  }

  if (todayLinksElement) {
    const now = new Date();

    const todayCount = links.filter((link) => {
      const date = new Date(link.createdAt);

      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    }).length;

    todayLinksElement.textContent = String(todayCount);
  }
}

// ==========================================
// SEARCH
// ==========================================

function applySearch() {
  const query = linkSearch
    ? linkSearch.value.trim().toLowerCase()
    : '';

  const filteredLinks = savedLinks.filter((link) => {
    const original = String(link.originalUrl || '').toLowerCase();
    const code = String(link.shortCode || '').toLowerCase();

    return original.includes(query) || code.includes(query);
  });

  renderLinks(filteredLinks);
}

// ==========================================
// LOAD LINKS FROM API
// ==========================================

async function loadLinks() {
  if (!linksList) return;

  try {
    const response = await fetch('/api/urls', {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Could not load your saved links.');
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Unexpected API response:', data);
      throw new Error('The server did not return a list of links.');
    }

    savedLinks = data.slice().sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;

      return dateB - dateA;
    });

    updateMetrics(savedLinks);
    applySearch();
  } catch (error) {
    console.error('Loading links failed:', error);

    if (tableSummary) {
      tableSummary.textContent =
        'Unable to load links. Please refresh and try again.';
    }
  }
}

// ==========================================
// CREATE A SHORT URL
// ==========================================

if (form && originalUrlInput && submitButton) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    hideMessage(urlError);
    hideMessage(apiError);
    hideMessage(copyMessage);
    hideResult();

    const originalUrl = originalUrlInput.value.trim();

    if (!originalUrl) {
      showMessage(urlError, 'Please enter a URL to get started.');
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
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ originalUrl })
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          'The server returned an unexpected response. Please try again.'
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          'Unable to shorten this URL. Please try again.'
        );
      }

      if (!data.shortUrl) {
        throw new Error(
          'The server responded, but no shortened URL was returned.'
        );
      }

      const generatedUrl = new URL(
        data.shortUrl,
        window.location.origin
      );

      if (!['http:', 'https:'].includes(generatedUrl.protocol)) {
        throw new Error('The server returned an invalid shortened URL.');
      }

      if (!shortUrl || !resultSection) {
        throw new Error('The URL result elements are missing from the page.');
      }

      shortUrl.textContent = data.shortUrl;
      shortUrl.href = generatedUrl.href;
      resultSection.hidden = false;

      // Refresh the dashboard using the latest database records.
      await loadLinks();

      resultSection.scrollIntoView({
        behavior: window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
          ? 'auto'
          : 'smooth',
        block: 'nearest'
      });
    } catch (error) {
      showMessage(
        apiError,
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  });
}

// ==========================================
// INPUT VALIDATION FEEDBACK
// ==========================================

if (originalUrlInput) {
  originalUrlInput.addEventListener('input', () => {
    hideMessage(urlError);
    hideMessage(apiError);
  });
}

// ==========================================
// COPY THE NEWLY CREATED SHORT URL
// ==========================================

if (copyButton && shortUrl) {
  copyButton.addEventListener('click', async () => {
    const url = shortUrl.href;

    if (!url || url === '#' || !shortUrl.textContent.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      copyButton.textContent = 'Copied!';
      showMessage(copyMessage, 'Your shortened link has been copied.');

      window.setTimeout(() => {
        copyButton.innerHTML =
          '<span aria-hidden="true">▢</span> Copy link';
      }, 2000);
    } catch {
      showMessage(
        copyMessage,
        'Automatic copying failed. Select and copy the link manually.'
      );
    }
  });
}

// ==========================================
// SEARCH EVENT
// ==========================================

if (linkSearch) {
  linkSearch.addEventListener('input', applySearch);
}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

document.querySelectorAll('[data-section]').forEach((button) => {
  button.addEventListener('click', () => {
    const sectionId = button.dataset.section;
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// FOOTER YEAR
// ==========================================

if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

loadLinks();
