// forgegrabber-client.js — Updated for Cloudflare Pages Functions
// No longer calls Express backend — uses serverless /api/ routes

const FG_BASE = "/api";

async function fgGet(path) {
  const res = await fetch(`${FG_BASE}${path}`);
  return res.json();
}

async function fgPost(path, body = {}) {
  const res = await fetch(`${FG_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

export const ForgeGrabber = {
  // Simple endpoints (no OpenAI needed)
  ping: () => fgGet("/forgegrabber/ping"),
  status: () => fgGet("/forgegrabber/status"),
  results: () => fgGet("/forgegrabber/results"),

  // AI endpoints (OpenAI proxy)
  generateImage: (prompt, options = {}) => fgPost("/image", {
    prompt,
    model: options.model || "dall-e-3",
    size: options.size || "1024x1024",
    n: options.n || 1,
    quality: options.quality || "standard"
  }),

  chat: (messages, options = {}) => fgPost("/chat", {
    messages,
    model: options.model || "gpt-4o",
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens || 2000
  }),

  scrape: (url) => fgPost("/scrape", { url }),

  // Keep grab/upload for compatibility
  grab: (data) => fgPost("/forgegrabber/grab", data),
  upload: (data) => fgPost("/forgegrabber/upload", data)
};
