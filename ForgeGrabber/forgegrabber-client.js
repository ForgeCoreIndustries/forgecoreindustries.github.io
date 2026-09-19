const FG_BASE = "https://forgecoreindustries.com/api/forgegrabber";

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
  ping: () => fgGet("/ping"),
  info: () => fgGet("/info"),
  grab: () => fgPost("/grab"),
  status: () => fgGet("/status"),
  results: () => fgGet("/results"),
  upload: (data) => fgPost("/upload", data)
};