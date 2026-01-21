/**
 * AURA OS - NEURAL BACKEND CORE
 * Manages persistent system state and AI reasoning.
 */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { GoogleGenAI, Modality, Type } from '@google/genai'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001

// Validate Environment
if (!process.env.API_KEY) {
  console.warn('\n[AURA WARNING] Gemini API Key missing.')
  console.warn('Set API_KEY in your environment (Render → Environment) or local .env.\n')
}

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'TEMP_KEY' })

// IN-MEMORY SYSTEM STATE
let systemState = {
  user: {
    name: 'Admin',
    robotName: 'Aura-X',
    credits: 12450.75,
    health: 100,
  },
  emails: [
    {
      id: 'e1',
      sender: 'Nexus_Systems',
      recipient: 'Admin',
      subject: 'System Upgrade v6.0',
      body: 'Neural mesh connectivity is now live.',
      timestamp: new Date(),
      isRead: false,
    },
  ],
  files: [{ id: 'f1', name: 'core_manifest.pdf', type: 'pdf', size: '1.2MB', timestamp: new Date() }],
  contacts: [{ id: 'c1', name: 'Nexus-7', phone: '+1-555-0199', status: 'online' }],
  logs: ['[INIT] Neural State Synchronized'],
}

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

/**
 * CORS
 * - Local dev origins:
 *    - http://localhost:3000
 *    - http://127.0.0.1:3000
 *    - http://10.0.2.15:3000 (VM network shown by Vite)
 * - GitHub Pages origin:
 *    - https://lrufee9-spec.github.io
 *
 * NOTE: GitHub Pages origin is ONLY the domain, not /repo-name.
 */
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://10.0.2.15:3000',
  'https://lrufee9-spec.github.io',
])

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser requests (Render health checks, curl, etc.)
      if (!origin) return cb(null, true)

      if (allowedOrigins.has(origin)) return cb(null, true)

      // Block everything else
      return cb(new Error(`CORS blocked for origin: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: false,
  })
)

// Optional: private network header (mostly for local network scenarios)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true')
  next()
})

app.use(express.json({ limit: '2mb' }))

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} from ${req.ip}`)
  next()
})

// Root
app.get('/', (req, res) => {
  res.send(`
    <body style="font-family: sans-serif; background: #020617; color: white; padding: 2rem;">
      <h1>AURA CORE ONLINE</h1>
      <p>Status: <span style="color:#10b981">ACTIVE</sp
