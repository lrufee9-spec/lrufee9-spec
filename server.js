/**
 * AURA OS - NEURAL BACKEND CORE
 * Manages persistent system state and AI reasoning.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Validate Environment
if (!process.env.API_KEY) {
  console.warn("\n[AURA WARNING] Gemini API Key missing in .env file.");
  console.warn("Please add API_KEY=your_key_here to enable neural processing.\n");
}

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "TEMP_KEY" });

// IN-MEMORY SYSTEM STATE
let systemState = {
  user: {
    name: 'Admin',
    robotName: 'Aura-X',
    credits: 12450.75,
    health: 100
  },
  emails: [
    { 
      id: 'e1', 
      sender: 'Nexus_Systems', 
      recipient: 'Admin', 
      subject: 'System Upgrade v6.0', 
      body: 'Neural mesh connectivity is now live.', 
      timestamp: new Date(), 
      isRead: false 
    }
  ],
  files: [
    { id: 'f1', name: 'core_manifest.pdf', type: 'pdf', size: '1.2MB', timestamp: new Date() }
  ],
  contacts: [
    { id: 'c1', name: 'Nexus-7', phone: '+1-555-0199', status: 'online' }
  ],
  logs: ["[INIT] Neural State Synchronized"]
};

// Security and CORS configuration
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true
}));

// Private Network Support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} from ${req.ip}`);
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <body style="font-family: sans-serif; background: #020617; color: white; padding: 2rem;">
      <h1>AURA CORE ONLINE</h1>
      <p>Status: <span style="color:#10b981">ACTIVE</span></p>
      <p>Listening: 0.0.0.0:${PORT}</p>
      <hr style="opacity: 0.1" />
      <p>VM Access: <a href="http://10.0.2.15:3001/api/health" style="color:#6366f1">http://10.0.2.15:3001/api/health</a></p>
    </body>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date(), version: '6.1.0' });
});

app.get('/api/system/state', (req, res) => {
  res.json(systemState);
});

app.post('/api/chat', async (req, res) => {
  const { messages, instruction } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: messages,
      config: {
        systemInstruction: instruction || "You are Aura OS. OS of this device.",
        tools: [{
          functionDeclarations: [
            {
              name: 'create_email',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  to: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  body: { type: Type.STRING }
                },
                required: ['to', 'subject', 'body']
              }
            }
          ]
        }]
      }
    });

    const text = response.text;
    const functionCalls = response.functionCalls || [];

    for (const call of functionCalls) {
      if (call.name === 'create_email') {
        systemState.emails.unshift({
          id: `e${Date.now()}`,
          ...call.args,
          timestamp: new Date(),
          isRead: false,
          sender: 'Aura_Assistant'
        });
        systemState.logs.unshift(`[EMAIL] Dispatched to ${call.args.to}`);
      }
    }

    res.json({ text, toolCalls: functionCalls });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Processing Error' });
  }
});

app.post('/api/terminal', async (req, res) => {
  const { command } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Simulate a terminal response: ${command}`,
      config: { systemInstruction: "You are Aura-CLI. Output raw text only." }
    });
    systemState.logs.unshift(`[CLI] ${command}`);
    res.json({ output: response.text });
  } catch (error) {
    res.status(500).json({ output: 'ERROR: ACCESS_DENIED' });
  }
});

app.post('/api/maps', async (req, res) => {
  const { query, lat, lng } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      },
    });
    res.json({
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Navigation Offline' });
  }
});

app.post('/api/speak', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ audioData });
  } catch (error) {
    res.status(500).json({ error: 'Voice Core Offline' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n============================================`);
  console.log(`AURA BACKEND ONLINE`);
  console.log(`VM IP Address:  http://10.0.2.15:${PORT}`);
  console.log(`Loopback:       http://127.0.0.1:${PORT}`);
  console.log(`============================================\n`);
});