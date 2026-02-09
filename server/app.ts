import { GoogleGenAI } from '@google/genai'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import type { NextFunction, Request, Response } from 'express'

const app = express()
dotenv.config()
const PORT = 4321
const ai = new GoogleGenAI({})

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
)

app.use(express.json())

app.get('/facts/stream', async (req, res) => {
  const {} = req.query
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })

  const result = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        role: 'user',
        parts: [{ text: `Give me historical facts about this day: ${today}` }],
      },
    ],
    config: {
      systemInstruction: `Return facts in this exact format, one per line/year: 
  <item><year>YEAR</year><fact>FACT_TEXT</fact></item>
  No other text or markdown.`,
    },
  })

  for await (const chunk of result) {
    res.write(chunk.text)
  }

  res.end()
})

app.use((req, res, next) => {
  res.status(404).json({
    message: `Endpoint not found: [${req.method}] ${req.originalUrl}`,
  })
})

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: (err instanceof Error && err.message) || 'Unknown server error',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
