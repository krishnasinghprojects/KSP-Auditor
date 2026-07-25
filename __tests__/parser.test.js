import { describe, it, expect } from 'vitest';
import { parseHtml } from '../lib/parser';

describe('HTML Parser Logic', () => {
  it('correctly parses all metrics in a happy path scenario', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="This is a test description." />
          <link rel="icon" href="/favicon.png" />
        </head>
        <body>
          <h1>First H1</h1>
          <h1>Second H1</h1>
          <p>This is a paragraph with some words to count.</p>
          <img src="good.jpg" alt="Good Image" />
          <img src="bad1.jpg" />
          <img src="bad2.jpg" alt="" />
          <img src="bad3.jpg" alt="   " />
        </body>
      </html>
    `;

    const result = parseHtml(html);

    expect(result.title).toBe('Test Page');
    expect(result.metaDescription).toBe('This is a test description.');
    expect(result.h1Count).toBe(2);
    expect(result.imagesMissingAlt).toBe(3); // bad1, bad2, bad3
    expect(result.wordCount).toBe(13); // "First H1 Second H1 This is a paragraph with some words to count." = 13 words
    expect(result.favicon).toBe('/favicon.png');
  });

  it('handles missing fields gracefully (Failure Case 1)', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <p>Just one paragraph.</p>
        </body>
      </html>
    `;

    const result = parseHtml(html);

    expect(result.title).toBe('');
    expect(result.metaDescription).toBe('');
    expect(result.h1Count).toBe(0);
    expect(result.imagesMissingAlt).toBe(0);
    expect(result.favicon).toBeUndefined(); // Returns undefined if neither icon nor shortcut icon exists
    expect(result.wordCount).toBe(3); // "Just one paragraph."
  });

  it('handles malformed HTML gracefully (Failure Case 2)', () => {
    // Malformed tags, unclosed quotes, etc. Cheerio handles this robustly.
    const html = `
      <title>Malformed Title</title>
      <meta name="description" content="No closing quote" >
      <H1>Capital H1</h1>
      <IMG SRC="img.jpg">
      <body>Word</body>
    `;

    const result = parseHtml(html);

    expect(result.title).toContain('Malformed Title'); // Cheerio tries its best
    expect(result.h1Count).toBe(1); // Case-insensitive
    expect(result.imagesMissingAlt).toBe(1); // Missing alt completely
    expect(result.wordCount).toBeGreaterThan(0); // Will parse at least some words
  });
});
