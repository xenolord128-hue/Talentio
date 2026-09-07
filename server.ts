import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import { Server as SocketIOServer, Socket } from "socket.io";
import { GoogleGenAI } from "@google/genai";
import webpush from "web-push";

dotenv.config();

const app = express();
const PORT = 3000;
const httpServer = http.createServer(app);

// Initialize Socket.IO with CORS support
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

// Web Push Configuration & In-Memory Store
interface PushSubRecord {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
}

const pushSubscriptionsMap = new Map<string, Map<string, PushSubRecord>>();

let vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "";
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";

if (!vapidPublicKey || !vapidPrivateKey) {
  const generated = webpush.generateVAPIDKeys();
  vapidPublicKey = generated.publicKey;
  vapidPrivateKey = generated.privateKey;
  console.info("Talentio: Auto-generated operational VAPID keys for PWA push notifications.");
}

webpush.setVapidDetails(
  "mailto:support@talentio.com",
  vapidPublicKey,
  vapidPrivateKey
);

async function sendPushToUser(userId: string, payload: {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{ action: string; title: string }>;
  vibrate?: number[];
  renotify?: boolean;
}) {
  const userSubs = pushSubscriptionsMap.get(userId);
  if (!userSubs || userSubs.size === 0) return;

  const payloadString = JSON.stringify(payload);
  const deadEndpoints: string[] = [];

  for (const [endpoint, sub] of userSubs.entries()) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys
        },
        payloadString,
        {
          TTL: 120
        }
      );
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        deadEndpoints.push(endpoint);
      }
    }
  }

  deadEndpoints.forEach(ep => userSubs.delete(ep));
}

// Track online user presence and active calls in memory
interface UserPresenceRecord {
  userId: string;
  online: boolean;
  lastSeen: number;
  socketIds: Set<string>;
}

const userPresenceMap = new Map<string, UserPresenceRecord>();
const moderationReports: Array<{
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: 'message' | 'user';
  targetId: string;
  reason: string;
  details?: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}> = [];

// Socket.IO Real-time Messaging and Presence Handlers
io.on("connection", (socket: Socket) => {
  let boundUserId: string | null = null;

  // 1. User registers their socket
  socket.on("join_user", (userId: string) => {
    if (!userId) return;
    boundUserId = userId;
    socket.join(`user:${userId}`);

    let record = userPresenceMap.get(userId);
    if (!record) {
      record = {
        userId,
        online: true,
        lastSeen: Date.now(),
        socketIds: new Set([socket.id])
      };
      userPresenceMap.set(userId, record);
    } else {
      record.online = true;
      record.lastSeen = Date.now();
      record.socketIds.add(socket.id);
    }

    // Broadcast user online status
    io.emit("presence_change", {
      userId,
      online: true,
      lastSeen: new Date().toISOString()
    });
  });

  // 2. Typing Indicators (with real-time forward to recipient)
  socket.on("typing_start", (data: { conversationId: string; senderId: string; senderName: string; receiverId: string }) => {
    if (!data.receiverId) return;
    socket.to(`user:${data.receiverId}`).emit("user_typing_start", {
      conversationId: data.conversationId,
      userId: data.senderId,
      userName: data.senderName
    });
  });

  socket.on("typing_stop", (data: { conversationId: string; senderId: string; receiverId: string }) => {
    if (!data.receiverId) return;
    socket.to(`user:${data.receiverId}`).emit("user_typing_stop", {
      conversationId: data.conversationId,
      userId: data.senderId
    });
  });

  // 3. Instant Real-time Message Forwarding & Push Notification Dispatch
  socket.on("message_send", async (data: { conversationId: string; message: any }) => {
    if (!data.message || !data.message.receiverId) return;
    const receiverRoom = `user:${data.message.receiverId}`;
    socket.to(receiverRoom).emit("message_received", {
      conversationId: data.conversationId,
      message: data.message
    });

    // Send Web Push notification to receiver
    const previewText = data.message.text 
      ? (data.message.text.length > 70 ? `${data.message.text.slice(0, 70)}...` : data.message.text)
      : (data.message.voiceNote ? '🎤 Sent a voice message' : (data.message.attachment ? '📎 Sent an attachment' : 'New message'));

    await sendPushToUser(data.message.receiverId, {
      title: `Message from ${data.message.senderName || 'Talentio Client'}`,
      body: previewText,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `msg-${data.message.id || Date.now()}`,
      data: {
        type: 'new_message',
        conversationId: data.conversationId,
        url: `/?page=chat&conversationId=${data.conversationId}`
      }
    });
  });

  // 4. Delivery & Seen Receipts
  socket.on("message_delivered", (data: { conversationId: string; messageId: string; senderId: string; receiverId: string }) => {
    if (!data.senderId) return;
    socket.to(`user:${data.senderId}`).emit("message_delivered", {
      conversationId: data.conversationId,
      messageId: data.messageId,
      deliveredAt: new Date().toISOString()
    });
  });

  socket.on("message_seen", (data: { conversationId: string; messageIds: string[]; senderId: string; receiverId: string }) => {
    if (!data.senderId) return;
    socket.to(`user:${data.senderId}`).emit("message_seen", {
      conversationId: data.conversationId,
      messageIds: data.messageIds,
      seenBy: data.receiverId,
      seenAt: new Date().toISOString()
    });
  });

  // 5. Presence Heartbeat
  socket.on("presence_heartbeat", (data: { userId: string }) => {
    if (!data.userId) return;
    const record = userPresenceMap.get(data.userId);
    if (record) {
      record.lastSeen = Date.now();
      record.online = true;
    }
  });

  // 7. Disconnect Handler
  socket.on("disconnect", () => {
    if (boundUserId) {
      const record = userPresenceMap.get(boundUserId);
      if (record) {
        record.socketIds.delete(socket.id);
        if (record.socketIds.size === 0) {
          record.online = false;
          record.lastSeen = Date.now();
          io.emit("presence_change", {
            userId: boundUserId,
            online: false,
            lastSeen: new Date().toISOString()
          });
        }
      }
    }
  });
});

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

// Web Push: VAPID Public Key for client subscription
app.get("/api/push/vapid-public-key", (_req: Request, res: Response) => {
  res.json({ publicKey: vapidPublicKey });
});

// Web Push: Subscribe endpoint
app.post("/api/push/subscribe", (req: Request, res: Response) => {
  const { userId, subscription, userAgent } = req.body;
  if (!userId || !subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "userId and valid subscription are required" });
  }

  if (!pushSubscriptionsMap.has(userId)) {
    pushSubscriptionsMap.set(userId, new Map());
  }

  pushSubscriptionsMap.get(userId)!.set(subscription.endpoint, {
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    userAgent
  });

  res.json({
    success: true,
    message: "Device registered for Web Push notifications",
    registeredDevices: pushSubscriptionsMap.get(userId)!.size
  });
});

// Web Push: Unsubscribe endpoint
app.post("/api/push/unsubscribe", (req: Request, res: Response) => {
  const { userId, endpoint } = req.body;
  if (!userId || !endpoint) {
    return res.status(400).json({ error: "userId and endpoint are required" });
  }

  const userSubs = pushSubscriptionsMap.get(userId);
  if (userSubs) {
    userSubs.delete(endpoint);
  }
  res.json({ success: true, message: "Device unregistered from Web Push" });
});

// Web Push: Trigger Test Notification
app.post("/api/push/test", async (req: Request, res: Response) => {
  const { userId, title, body } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  await sendPushToUser(userId, {
    title: title || "Talentio Test Notification",
    body: body || "Web Push is operating seamlessly across your PWA devices!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: `test-${Date.now()}`,
    data: {
      url: "/?page=chat"
    }
  });

  res.json({ success: true, message: "Test notification dispatched." });
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

// ============================================================================
// CHAT & CALL PLATFORM REAL-TIME & ADMIN API ENDPOINTS
// ============================================================================

// Admin: Real-time Communication Statistics
app.get("/api/chat/admin-stats", (_req: Request, res: Response) => {
  let onlineCount = 0;
  userPresenceMap.forEach(record => {
    if (record.online) onlineCount++;
  });

  res.json({
    activeCalls: 0,
    onlineUsersCount: onlineCount,
    totalReports: moderationReports.length,
    pendingReports: moderationReports.filter(r => r.status === 'pending').length,
    systemStatus: "operational",
    activeCallsList: []
  });
});

// User: Submit Moderation / Abuse Report
app.post("/api/chat/reports", (req: Request, res: Response) => {
  const { reporterId, reporterName, targetType, targetId, reason, details } = req.body;
  if (!reporterId || !targetId || !reason) {
    return res.status(400).json({ error: "reporterId, targetId and reason are required" });
  }

  const report = {
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reporterId,
    reporterName: reporterName || "Anonymous User",
    targetType: targetType || "message",
    targetId,
    reason,
    details: details || "",
    timestamp: new Date().toISOString(),
    status: "pending" as const
  };

  moderationReports.unshift(report);
  res.status(201).json({ success: true, report });
});

// Admin: List Moderation Reports
app.get("/api/chat/reports", (_req: Request, res: Response) => {
  res.json(moderationReports);
});

// Admin: Update Moderation Report Status (resolve, dismiss)
app.patch("/api/chat/reports/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const report = moderationReports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  if (status) {
    report.status = status;
  }
  res.json({ success: true, report });
});

// User: Check Presence Status for specific user IDs
app.post("/api/chat/presence-batch", (req: Request, res: Response) => {
  const { userIds } = req.body;
  if (!Array.isArray(userIds)) {
    return res.status(400).json({ error: "userIds array is required" });
  }

  const result: Record<string, { online: boolean; lastSeen: string }> = {};
  userIds.forEach(uid => {
    const record = userPresenceMap.get(uid);
    if (record) {
      result[uid] = {
        online: record.online,
        lastSeen: new Date(record.lastSeen).toISOString()
      };
    } else {
      result[uid] = {
        online: false,
        lastSeen: "Offline"
      };
    }
  });

  res.json(result);
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Talentio server with Socket.IO running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
