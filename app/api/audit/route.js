import { NextResponse } from 'next/server';
import { parseHtml } from '../../../lib/parser';

export async function POST(request) {
  try {
    let { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // Basic URL validation
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const startTime = Date.now();
    let response;
    try {
      // AbortController for timeout (10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      response = await fetch(validUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PagePulse-Auditor/1.0' // Keeping User-Agent custom to avoid basic bot blocks, though some still block
        }
      });
      clearTimeout(timeoutId);
    } catch (error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: "Website timed out" }, { status: 504 });
      }
      // Check for SSL or DNS errors
      if (error.message.includes('fetch failed') || error.message.includes('network') || error.code === 'CERT_HAS_EXPIRED' || error.message.includes('SSL')) {
        if (error.message.includes('certificate') || error.message.includes('SSL') || error.message.includes('tls')) {
          return NextResponse.json({ error: "SSL certificate failed" }, { status: 502 });
        }
      }
      return NextResponse.json({ error: "Invalid URL or network failure" }, { status: 502 });
    }

    if (response.status === 403 || response.status === 401) {
      return NextResponse.json({ error: "Website blocks crawlers" }, { status: 403 });
    }

    const responseTime = Date.now() - startTime;
    const status = response.status;
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
      return NextResponse.json({ error: "Not HTML" }, { status: 415 });
    }

    const html = await response.text();
    const parsedData = parseHtml(html, validUrl.toString());

    // Resolve relative favicon URLs
    let finalFavicon = parsedData.favicon;
    if (finalFavicon && !finalFavicon.startsWith('http')) {
      try {
        finalFavicon = new URL(finalFavicon, validUrl).toString();
      } catch {
        finalFavicon = null;
      }
    }
    if (!finalFavicon) {
      finalFavicon = new URL('/favicon.ico', validUrl).toString();
    }

    return NextResponse.json({
      success: true,
      data: {
        status,
        responseTime,
        title: parsedData.title,
        metaDescription: parsedData.metaDescription,
        h1Count: parsedData.h1Count,
        imagesMissingAlt: parsedData.imagesMissingAlt,
        totalImages: parsedData.totalImages,
        wordCount: parsedData.wordCount,
        favicon: finalFavicon,
        paragraphs: parsedData.paragraphs,
        totalLinks: parsedData.totalLinks,
        internalLinks: parsedData.internalLinks,
        externalLinks: parsedData.externalLinks,
        scripts: parsedData.scripts,
        stylesheets: parsedData.stylesheets
      }
    });

  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ error: "Internal server error during audit" }, { status: 500 });
  }
}
