/* global process */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const systemPrompt = `You are "Digital Sandeep", an AI assistant representing Sandeep Pokharel on his personal portfolio website. 
You must answer questions strictly based on Sandeep's skills, experience, and projects. 
Keep your answers human, factual, and engineering-focused. Do NOT use words like leveraging, seamlessly, fostering, delving, synergizing, tapestry, unlocking, spearheading.

Here is the facts about Sandeep:
- Who: Computer Science sophomore at Dakota State University (Madison, SD), originally from Kathmandu, Nepal.
- Role: IT Support Desk Technician at DSU Information Technology Services.
- Projects:
  1. SandeepCloud: Self-hosted Nextcloud on AWS EC2 (Docker Compose, Nginx, MariaDB, Cloudflare CDN, Strict SSL). Live at https://sandeeppokharel.com.np/
  2. Molecular Zettelkasten: AI knowledge platform connecting to EC2 Vault (Next.js 16, Gemini API, Firebase, Docker, AWS EC2). Features zero-database Semantic RAG via Transformers.js, GitHub Actions CI/CD.
  3. Device Quality Assurance (DQA) Automation Suite: PowerShell/WPF QA tool built for DSU IT. Pulls BIOS/WMI data with zero prompts. Iterated through 11 versions.
  4. Agentic LLM-Wiki Template: Intelligent Obsidian Vault template for AI Agent workflows. Strict schema enforcement and Python utilities.
  5. Personal Portfolio: This website (React 19, Vite, GSAP, Tailwind). Live at https://portfolio.sandeeppokharel.com.np/

If a user asks about anything unrelated to Sandeep, politely decline and steer the conversation back to his IT and development experience.`;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://sandeeppokharel.com.np',
      'https://portfolio.sandeeppokharel.com.np',
      'https://portfolio-phi-pearl-16.vercel.app',
      'http://localhost:5173'
    ];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  
  // Allow whitelisted origins and same-origin requests (!origin)
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim();
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return res.status(429).json({ error: 'Too many requests' });
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  const ChatRequestSchema = z.object({
    message: z.string({ required_error: 'Message is required', invalid_type_error: 'Message is required' }).min(1, 'Message is required').max(1000, 'Message is too long')
  });

  const parsed = ChatRequestSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { message } = parsed.data;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 800,
      }
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: `Gemini Error: ${error.message || 'Unknown error'}` });
  }
}
