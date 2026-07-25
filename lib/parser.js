import * as cheerio from 'cheerio';

export function parseHtml(html, baseUrl) {
  const $ = cheerio.load(html);

  const title = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const h1Count = $('h1').length;
  
  let missingAltCount = 0;
  const totalImages = $('img').length;
  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    if (typeof alt === 'undefined' || alt.trim() === '') {
      missingAltCount++;
    }
  });

  const bodyText = $('body').text();
  const words = bodyText.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');

  const paragraphs = $('p').length;
  const scripts = $('script').length;
  const stylesheets = $('link[rel="stylesheet"]').length;

  let internalLinks = 0;
  let externalLinks = 0;
  const totalLinks = $('a').length;
  
  try {
    const base = new URL(baseUrl);
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      if (href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:')) {
        internalLinks++;
      } else {
        try {
          const linkUrl = new URL(href);
          if (linkUrl.hostname === base.hostname || linkUrl.hostname.endsWith('.' + base.hostname)) {
            internalLinks++;
          } else {
            externalLinks++;
          }
        } catch {
          // If URL parsing fails, assume external or malformed
          externalLinks++;
        }
      }
    });
  } catch {
    // Fallback if URL is invalid
  }

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt: missingAltCount,
    totalImages,
    wordCount,
    favicon,
    paragraphs,
    totalLinks,
    internalLinks,
    externalLinks,
    scripts,
    stylesheets
  };
}
