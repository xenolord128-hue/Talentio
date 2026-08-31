import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured. AI endpoints will return graceful fallbacks.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "talentio-platform/1.0",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", app: "Talentio", timestamp: new Date().toISOString() });
});

// AI: Natural Language Talent Search
app.post("/api/ai/talent-search", async (req: Request, res: Response) => {
  try {
    const { query, availableTalents } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        matchedSkillKeywords: [query],
        recommendedCategory: "web-development",
        summary: `Searching for profiles related to "${query}"`,
        topTalentIds: availableTalents?.slice(0, 3).map((t: { id: string }) => t.id) || []
      });
    }

    const prompt = `You are the AI Matchmaker for Talentio, an international digital talent marketplace.
A client entered this search request: "${query}".
Here is the list of available talents (metadata only):
${JSON.stringify((availableTalents || []).map((t: any) => ({
  id: t.id,
  name: t.name,
  title: t.title,
  skills: t.skills,
  category: t.category,
  hourlyRate: t.hourlyRate,
  rating: t.rating,
  bio: t.bio
})))}

Analyze the client's intent. Return ONLY a valid JSON object matching this schema:
{
  "matchedSkillKeywords": ["skill1", "skill2"],
  "recommendedCategory": "category_slug",
  "maxBudgetEstimate": number_or_null,
  "summary": "Brief 1-2 sentence explanation of what the client is looking for and why selected talents fit",
  "topTalentIds": ["talent_id_1", "talent_id_2"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI talent search error:", error);
    res.status(500).json({ error: "Failed to perform AI talent search", details: error.message });
  }
});

// AI: Project Brief Assistant (Helps clients create structured project specifications)
app.post("/api/ai/project-assistant", async (req: Request, res: Response) => {
  try {
    const { rawIdea, category, budget, timeline } = req.body;
    if (!rawIdea) {
      return res.status(400).json({ error: "Project idea is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        title: `Project: ${rawIdea.slice(0, 50)}...`,
        refinedDescription: `Scope of Work:\n${rawIdea}\n\nKey Deliverables:\n- Architecture & Implementation\n- Responsive Design\n- Testing & Deployment`,
        suggestedSkills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
        recommendedMilestones: [
          { title: "Milestone 1: Design & Architecture Spec", percentage: 30 },
          { title: "Milestone 2: Core Development & Implementation", percentage: 50 },
          { title: "Milestone 3: Final QA, Testing & Deployment", percentage: 20 }
        ]
      });
    }

    const prompt = `You are a Senior Project Architect at Talentio helping a client draft a world-class project post.
Client's raw description: "${rawIdea}"
Selected Category: "${category || 'Not specified'}"
Estimated Budget: "${budget || 'Flexible'}"
Timeline: "${timeline || 'Flexible'}"

Generate a polished, professional project brief. Return ONLY a valid JSON object matching this schema:
{
  "title": "A crisp, high-converting professional project title (e.g. 'Build Real-Time Collaboration Tool...')",
  "refinedDescription": "A complete, well-structured description with 'Overview', 'Key Deliverables', 'Technical Requirements', and 'Quality Expectations'",
  "suggestedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "recommendedMilestones": [
    { "title": "Milestone name", "percentage": 30, "description": "Brief outcome" },
    { "title": "Milestone name", "percentage": 50, "description": "Brief outcome" },
    { "title": "Milestone name", "percentage": 20, "description": "Brief outcome" }
  ],
  "experienceLevelRecommendation": "entry" | "intermediate" | "expert"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI project assistant error:", error);
    res.status(500).json({ error: "Failed to generate project brief", details: error.message });
  }
});

// AI: Proposal Assistant (Helps talents write winning tailored proposals)
app.post("/api/ai/proposal-assistant", async (req: Request, res: Response) => {
  try {
    const { projectTitle, projectDescription, talentName, talentTitle, talentSkills, talentBio } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        coverLetter: `Hi,\n\nI am excited to submit my proposal for "${projectTitle}". With my background as a ${talentTitle} specializing in ${talentSkills?.slice(0, 3).join(', ')}, I am confident in delivering exceptional results on schedule.\n\nLooking forward to discussing the milestones with you!\n\nBest regards,\n${talentName}`,
        suggestedKeyStrengths: ["Relevant technical expertise", "Clear milestone communication", "Fast turnaround"],
        relevantQuestions: ["Do you have specific third-party APIs or authentication providers in mind?"]
      });
    }

    const prompt = `You are an elite Proposal Coach for top-tier digital freelancers on Talentio.
Project Title: "${projectTitle}"
Project Description: "${projectDescription}"
Talent Profile:
- Name: ${talentName}
- Title: ${talentTitle}
- Skills: ${talentSkills?.join(', ')}
- Bio: ${talentBio}

Write a persuasive, authentic, and highly professional proposal that directly references the project requirements without sounding robotic. Return ONLY a valid JSON object matching this schema:
{
  "coverLetter": "The complete cover letter text with greeting, relevant experience proof, approach strategy, and strong call to action.",
  "suggestedKeyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "relevantQuestions": ["Clarifying question 1", "Clarifying question 2"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI proposal assistant error:", error);
    res.status(500).json({ error: "Failed to generate proposal", details: error.message });
  }
});

// AI: Profile Enhancer (Helps talents elevate their bio, title & skills)
app.post("/api/ai/profile-enhancer", async (req: Request, res: Response) => {
  try {
    const { currentTitle, currentBio, skills, category } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        improvedTitle: currentTitle || "Senior Full-Stack & Cloud Specialist",
        improvedBio: (currentBio || "") + "\n\nDedicated to delivering measurable business impact, reliable clean code, and fast communication.",
        suggestedSkillsToAdd: ["System Architecture", "Performance Optimization"],
        profileStrengthTips: ["Add 2 case studies with metrics", "Specify client communication cadence"]
      });
    }

    const prompt = `You are a Career Consultant for international digital professionals on Talentio.
Category: ${category}
Current Title: "${currentTitle}"
Current Bio: "${currentBio}"
Current Skills: ${skills?.join(', ')}

Provide high-impact improvements to boost conversion and client trust. Return ONLY a valid JSON object matching this schema:
{
  "improvedTitle": "Polished high-impact professional title",
  "improvedBio": "Engaging, authoritative, 2-3 paragraph biography highlighting quantifiable results and client outcomes",
  "suggestedSkillsToAdd": ["skill1", "skill2", "skill3"],
  "profileStrengthTips": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI profile enhancer error:", error);
    res.status(500).json({ error: "Failed to enhance profile", details: error.message });
  }
});

// AI: Talentio Multi-Turn Assistant Chatbot
app.post("/api/ai/assistant", async (req: Request, res: Response) => {
  try {
    const { messages, userRole } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        reply: "Welcome to Talentio AI! I can help you discover verified digital talent, scope out your project requirements, estimate market rates, or optimize your freelance profile. How can I assist you today?"
      });
    }

    const systemInstruction = `You are "Talentio AI", the intelligent concierge for Talentio — the international digital talent marketplace and collaboration platform.
The current user is interacting as a: "${userRole || 'visitor'}".
Your capabilities:
1. Recommend top talent categories, average market rates, and milestone scopes.
2. Help clients turn high-level ideas into concrete requirements and budget guidelines.
3. Help talents write winning proposals, price their services, and polish their portfolios.
4. Explain how Talentio's Escrow protection, milestone verification, and workspace collaboration work.
Maintain a warm, knowledgeable, concise, and professional tone. Keep answers structured and easy to read.`;

    const chatHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: chatHistory,
      config: {
        systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI assistant error:", error);
    res.status(500).json({ error: "Failed to chat with AI assistant", details: error.message });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Talentio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
