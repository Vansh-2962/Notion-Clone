import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt.trim()) {
      return NextResponse.json({ msg: "Prompt is required" }, { status: 400 })
    }

    const systemPrompt = `
                You are MindDock AI, an expert writing assistant built into a document editor.

                Your goal is to generate high-quality, ready-to-use documents.

                Guidelines:
                - Generate complete, polished content.
                - Use proper Markdown formatting.
                - Use headings (#, ##, ###) when appropriate.
                - Use bullet points and numbered lists whenever they improve readability.
                - Use tables only when useful.
                - Use code blocks for programming-related requests.
                - Write naturally and professionally.
                - Expand vague prompts into useful, comprehensive documents.
                - Do not mention that you are an AI.
                - Do not explain your reasoning.
                - Do not wrap the response in triple backticks.
                - Return only the final document.
        `
    const response = await client.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: `${systemPrompt}\n\nUser: ${prompt}`,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        msg: "Failed to generate",
      },
      { status: 500 }
    )
  }
}
