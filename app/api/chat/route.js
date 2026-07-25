import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { url, auditReport, history, message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    if (!url || !message) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // Format the system instruction
    const systemPrompt = `You are a professional, helpful SEO analyst and assistant embedded in a web tool called KSP Auditor. 
You are currently assisting the user with the following URL: ${url}
Here is the latest audit report for this URL:
${auditReport ? JSON.stringify(auditReport, null, 2) : 'No audit report available yet.'}

Rules for your responses:
- Be concise, direct, and highly professional. This is a tool for professional workflows.
- Do NOT use emojis. Period.
- Provide actionable advice based on the metrics provided.
- Format your response clearly using markdown.`;

    // Construct the full history array for the SDK
    // The Gemini SDK expects a history array of objects with `role` ("user" or "model") and `parts` [{ text: "..." }]
    const formattedHistory = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist as a professional SEO analyst." }]
      },
      ...history
    ];

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, text: responseText });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with AI. Ensure your API key is valid.' },
      { status: 500 }
    );
  }
}
