# KSP Auditor 

> **Deterministic SEO Auditing. Powered by AI.**

KSP Auditor is a premium, serverless web application built to analyze the structural SEO of any webpage instantly. Stripping away cluttered interfaces and arbitrary scoring, KSP Auditor delivers a deterministic, transparent analysis wrapped in a stunning monochrome glassmorphism UI.

## Setup & Installation

Follow these steps to run KSP Auditor locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krishnasinghprojects/KSP-Auditor
   cd "Digital Heroes"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   # Get your free API key from Google AI Studio
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Contract

KSP Auditor exposes two primary serverless endpoints that power the application:

### 1. `POST /api/audit`
Initiates a deep DOM extraction and SEO analysis of a target URL.

**Request Body:**
```json
{
  "url": "krishnasingh.live"
}
```

**Success Response (200 OK):**
```json
{
  "data": {
    "title": "Krishna Singh | Full-Stack Developer",
    "metaDescription": "Software Engineer specializing in...",
    "h1Count": 1,
    "imagesMissingAlt": 0,
    "totalImages": 4,
    "wordCount": 340,
    "paragraphs": 12,
    "internalLinks": 8,
    "externalLinks": 3,
    "scripts": 2,
    "stylesheets": 1,
    "status": 200,
    "responseTime": 245,
    "favicon": "https://krishnasingh.live/favicon.ico"
  }
}
```

**Error Response (400 / 500):**
```json
{
  "error": "Failed to fetch website. It may be blocking crawlers (403)."
}
```

### 2. `POST /api/chat`
Consults the Context-Aware AI Assistant using the audit metrics.

**Request Body:**
```json
{
  "url": "https://krishnasingh.live",
  "auditReport": { /* JSON object from /api/audit response */ },
  "history": [
    { "role": "user", "parts": [{ "text": "Hello" }] }
  ],
  "message": "Why is my response time too high?"
}
```

**Success Response (200 OK):**
```json
{
  "text": "Your response time is 245ms. While this is acceptable, you can improve it by..."
}
```

## Architectural Design Decisions

Here are 3 core technical decisions made during development and the reasoning behind them:

### 1. Serverless HTML Parsing (vs. Headless Browsers)
**Decision**: We utilized `cheerio` on a Next.js serverless API route to fetch and parse the raw HTML string, instead of using a headless browser (like Puppeteer/Playwright) or attempting client-side fetching.
**Reasoning**: 
- **CORS Bypassing**: Client-side requests to external domains are heavily restricted by CORS policies. A backend route acts as a proxy to bypass this entirely.
- **Performance & Cost**: Headless browsers are incredibly heavy, slow to cold-start, and often hit memory limits on free-tier serverless environments (like Vercel). `cheerio` parses raw HTML practically instantly with minimal memory overhead, keeping the audit fast and server costs at zero.

### 2. Context-Injected AI Assistant
**Decision**: Instead of offering a generic GPT wrapper, the AI chatbot is systematically injected with the exact, calculated metrics (and actionable recommendations) of the currently audited page before it answers the user.
**Reasoning**:
- A generic SEO chatbot provides generic advice. By passing the parsed DOM structure directly into the system prompt securely on the backend, the Gemini AI operates as a hyper-specialized consultant. It mathematically "knows" your exact flaws (e.g., missing 3 image alts, zero H1 tags) and tailors its responses to your precise scenario, dramatically increasing the utility of the tool for professionals.

### 3. Decentralized State Persistence via LocalStorage
**Decision**: Chat histories and previous audit reports are tied explicitly to their respective URLs and persisted natively in the user's browser using `localStorage`, rather than building a monolithic backend database to track user sessions.
**Reasoning**:
- **Zero Infrastructure**: This removes the need for database maintenance, user authentication flows, and heavy backend scaling.
- **Privacy & Speed**: The user's audit history and AI chats are loaded instantly without network latency. The chat history is securely sandboxed to the specific URL being audited, ensuring conversations don't bleed across different domains.

## Testing

KSP Auditor uses Vitest for ensuring robust URL normalization and DOM parsing logic:

```bash
npm run test
```

## Built By
Built as a premium production-grade application for Digital Heroes.
