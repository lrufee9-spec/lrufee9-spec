import { Message, Role } from "../types";
import { Type, FunctionDeclaration } from "@google/genai";

/**
 * AURA NEURAL DISCOVERY (VM OPTIMIZED)
 * Probing candidate addresses to establish the neural link.
 */
let discoveryPromise: Promise<string> | null = null;
let currentBase = 'http://127.0.0.1:3001/api';

const discoverBackend = async (): Promise<string> => {
  const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
  const candidates = [
    `http://127.0.0.1:3001/api`,
    `http://10.0.2.15:3001/api`, // Ubuntu VM Default IP
    `http://localhost:3001/api`,
    `http://${host}:3001/api`,
    `http://10.0.2.2:3001/api`   // VirtualBox Host Gateway
  ];

  console.log("[AURA] Probing for Backend Core...");

  for (const url of candidates) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(`${url}/health`, { 
        signal: controller.signal,
        mode: 'cors',
        cache: 'no-cache'
      });
      clearTimeout(id);
      if (res.ok) {
        console.log(`[AURA] Neural Link Established: ${url}`);
        currentBase = url;
        return url;
      }
    } catch (e) {
      // Continue to next candidate
    }
  }
  
  console.warn("[AURA] Discovery failed. Using fallback:", currentBase);
  return currentBase;
};

const getApiBase = async () => {
  if (!discoveryPromise) {
    discoveryPromise = discoverBackend();
  }
  return discoveryPromise;
};

export const securityTools: FunctionDeclaration[] = [
  {
    name: 'triggerEmergencyAlert',
    parameters: {
      type: Type.OBJECT,
      description: 'Trigger an emergency alert when a threat is detected.',
      properties: {
        reason: {
          type: Type.STRING,
          description: 'The reason for the alert, describing the threat or distress detected.',
        },
      },
      required: ['reason'],
    },
  },
];

export const AuraAPI = {
  getApiUrl: () => currentBase,

  checkConnection: async () => {
    discoveryPromise = null; 
    const url = await getApiBase();
    try {
      const res = await fetch(`${url}/health`);
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  getSystemState: async () => {
    try {
      const base = await getApiBase();
      const res = await fetch(`${base}/system/state`, {
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("State Sync Failed:", e);
      return null;
    }
  },

  chat: async (messages: Message[], onChunk: (chunk: string) => void) => {
    const base = await getApiBase();
    const formattedMessages = messages.map(m => ({
      role: m.role === Role.USER ? 'user' : 'model',
      parts: [
        { text: m.content },
        ...(m.attachments?.map(att => ({
          inlineData: { mimeType: att.mimeType, data: att.base64 }
        })) || [])
      ]
    }));

    try {
      const res = await fetch(`${base}/chat`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: formattedMessages,
          instruction: "You are Aura Intelligence. OS of this device. Use tools for emails/logs."
        })
      });
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.text) onChunk(data.text);
      return { fullText: data.text, toolResults: data.toolCalls };
    } catch (error) {
      console.error("Chat Relay Failed:", error);
      return { 
        fullText: `Neural relay failure. Attempting to reach backend at ${base}. Ensure "node server.js" is running and dependencies are installed via "npm install".`, 
        toolResults: [] 
      };
    }
  },

  speak: async (text: string) => {
    try {
      const base = await getApiBase();
      const res = await fetch(`${base}/speak`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      return data.audioData;
    } catch (e) {
      return null;
    }
  },

  getMapsInfo: async (query: string, lat: number, lng: number) => {
    try {
      const base = await getApiBase();
      const res = await fetch(`${base}/maps`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lat, lng })
      });
      return await res.json();
    } catch (e) {
      return { text: "Navigation subsystem offline.", sources: [] };
    }
  },

  terminalCommand: async (command: string) => {
    try {
      const base = await getApiBase();
      const res = await fetch(`${base}/terminal`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      return data.output;
    } catch (e) {
      return "SYSTEM_ERROR: CORE_ACCESS_DENIED";
    }
  }
};