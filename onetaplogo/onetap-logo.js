// OneTap Logo Builder – ForgeCore OS Version
// UI → Backend (/api/onetap/generate) → DalleEngine5_0 → Canvas + Downloads

let currentArtwork = null;
let currentFontIndex = 0;
let showBackground = true;

const fonts = [
  "Segoe UI",
  "Montserrat",
  "Poppins",
  "Oswald",
  "Roboto Condensed"
];

// ---------- CORE GENERATION ----------

async function generateLogo() {
  const brandInput = document.getElementById("brandInput");
  const brand = brandInput ? brandInput.value.trim() || "ForgeCore" : "ForgeCore";

  const preview = document.getElementById("logoPreview");
  const status = document.getElementById("generateStatus");
  const canvasWrap = document.getElementById("canvasWrap");
  const canvas = document.getElementById("logoCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  if (status) status.textContent = "Generating logo...";
  if (preview) preview.textContent = "Working…";

  try {
    const response = await fetch("http://localhost:3000/api/onetap/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || "Generation failed");

    const artwork = data.artwork;
    currentArtwork = artwork;

    if (preview) preview.textContent = `Generated logo for: ${artwork.meta.prompt}`;
    if (status) status.textContent = "Logo generated successfully.";

    if (canvasWrap) canvasWrap.style.display = "block";

    if (ctx) {
      drawLogo(); // use shared renderer
    }
  } catch (err) {
    console.error(err);
    if (status) status.textContent = "Error generating logo.";
    if (preview) preview.textContent = "Generation failed.";
  }
}

// ---------- CANVAS RENDERING ----------

function drawLogo() {
  const canvas = document.getElementById("logoCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const bgColorEl = document.getElementById("bgColor");
  const textColorEl = document.getElementById("textColor");
  const accentColorEl = document.getElementById("accentColor");

  const bgColor = bgColorEl ? bgColorEl.value : "#0a0a0a";
  const textColor = textColorEl ? textColorEl.value : "#f59e0b";
  const accentColor = accentColorEl ? accentColorEl.value : "#ffffff";

  // Background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (showBackground) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // If we have AI artwork, draw shapes
  if (currentArtwork && currentArtwork.shapes) {
    const colors = [textColor, accentColor, "#ef4444", "#22c55e", "#3b82f6", "#a855f7"];

    currentArtwork.shapes.forEach(shape => {
      ctx.beginPath();
      shape.points.forEach((pt, idx) => {
        const x = pt.x * 4; // scale from 0–100 space
        const y = pt.y * 3;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = colors[shape.colorIndex % colors.length];
      ctx.fill();
    });
  }

  // Brand text overlay
  const brandInput = document.getElementById("brandInput");
  const brand = brandInput ? brandInput.value.trim() || "ForgeCore" : "ForgeCore";

  ctx.font = `bold 42px ${fonts[currentFontIndex % fonts.length]}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(brand, canvas.width / 2, canvas.height - 60);
}

// ---------- DOWNLOADS ----------

function downloadLogo(type) {
  const canvas = document.getElementById("logoCanvas");
  if (!canvas) return;

  const mime = type === "jpg" ? "image/jpeg" : "image/png";
  const dataURL = canvas.toDataURL(mime);

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = type === "jpg" ? "onetap-logo.jpg" : "onetap-logo.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------- FONT & BG CONTROLS ----------

function cycleFonts() {
  currentFontIndex = (currentFontIndex + 1) % fonts.length;
  drawLogo();
}

function toggleBg() {
  showBackground = !showBackground;
  drawLogo();
}

// ---------- EVENT BINDING ----------

document.addEventListener("DOMContentLoaded", () => {
  const genBtn = document.getElementById("genBtn");
  if (genBtn) genBtn.addEventListener("click", generateLogo);

  const bgColorEl = document.getElementById("bgColor");
  const textColorEl = document.getElementById("textColor");
  const accentColorEl = document.getElementById("accentColor");

  if (bgColorEl) bgColorEl.addEventListener("change", drawLogo);
  if (textColorEl) textColorEl.addEventListener("change", drawLogo);
  if (accentColorEl) accentColorEl.addEventListener("change", drawLogo);

  // Expose functions for buttons in HTML
  window.downloadLogo = downloadLogo;
  window.cycleFonts = cycleFonts;
  window.toggleBg = toggleBg;
  window.drawLogo = drawLogo;
});