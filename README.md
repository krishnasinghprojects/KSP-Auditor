# KSP Auditor 🚀

> **Deterministic SEO Auditing. Powered by AI.**

KSP Auditor is a premium, serverless web application built to analyze the structural SEO of any webpage instantly. Stripping away cluttered interfaces and arbitrary scoring, KSP Auditor delivers a deterministic, transparent analysis wrapped in a stunning monochrome glassmorphism UI.

## 🔥 Key Features

- **Context-Aware AI Assistant**: Powered by the Gemini API, the integrated chatbot natively ingests your exact audit metrics and generated recommendations. It provides hyper-specific, actionable advice for the precise URL you are analyzing.
- **Deep Structural Analytics**: Utilizes high-performance DOM parsing (`cheerio`) to extract paragraphs, H1 counts, internal/external links, missing image alts, and script/stylesheet usage—bypassing CORS entirely on the serverless backend.
- **Deterministic Scoring Engine**: Calculates a strict, predictable score out of 100 based on core SEO fundamentals, entirely transparent to the user.
- **Database-Free Sharing**: Share your audit reports instantly via unique URLs. Our serverless architecture encodes the target URL dynamically into the route (`/[slug]`), rendering the live report for anyone on the internet without bloated database storage.
- **Lightning-Fast PDF Export**: Instantly export your clean, data-focused audit report to PDF using `jsPDF`.
- **Premium Glassmorphism UI**: A strictly monochrome (black, white, and gray) design language prioritizing focus and data legibility over unnecessary colors. Fully responsive across desktop and mobile.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism)
- **Parsing Engine**: [Cheerio](https://cheerio.js.org/)
- **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini API)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

First, clone the repository and install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Set up your environment variables by creating a `.env.local` file in the root directory:

```env
# Get your free API key from Google AI Studio
GEMINI_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Landing Page.
Navigate to the "Try Our Product" section to launch the auditor tool.

## 🧪 Running Tests

KSP Auditor uses Vitest for ensuring robust URL normalization and DOM parsing logic:

```bash
npm run test
```

## 👨‍💻 Built By
Built as a premium production-grade application for Digital Heroes.
