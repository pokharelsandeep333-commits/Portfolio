/* global process */
import { GoogleGenerativeAI } from '@google/generative-ai';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
