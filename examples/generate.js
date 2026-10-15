import { createAvatar, getIllustratedAvatars } from "../src/index.js";
import { writeFile } from "node:fs/promises";

// 1. Fetch the 16 hand-drawn illustrated circular avatars cropped from the user's artwork
const illustratedList = getIllustratedAvatars();

const avatarMetadata = [
  { id: 1, name: "Laughing Guy in Purple Hoodie", desc: "Lilac Circle • Short textured hair & joyful laugh" },
  { id: 2, name: "Girl in Baseball Cap", desc: "Sunny Yellow Circle • Long dark hair & cap" },
  { id: 3, name: "Wavy Hair Guy with Glasses", desc: "Mint Circle • Green hoodie & round glasses" },
  { id: 4, name: "Winking Girl with Top Knot", desc: "Rose Pink Circle • Chic bun, winking & earring" },
  { id: 5, name: "Guy with Headphones", desc: "Sky Blue Circle • Short curly fade & audio cans" },
  { id: 6, name: "Wavy Hair Girl with Gold Hoop", desc: "Blush Peach Circle • Voluminous black waves" },
  { id: 7, name: "Guy with Beanie & Dye Bangs", desc: "Lavender Circle • Orange beanie & white bangs" },
  { id: 8, name: "Girl with Pastel Hijab", desc: "Warm Sunset Circle • Sky blue headwrap & smile" },
  { id: 9, name: "Guy with Shaggy Curly Hair", desc: "Mint Circle • Burgundy hoodie & side glance" },
  { id: 10, name: "Girl with Violet Beanie", desc: "Ice Blue Circle • Joyful open smile & long waves" },
  { id: 11, name: "Cool Guy with Sunglasses", desc: "Canary Yellow Circle • Dark shades & jacket" },
  { id: 12, name: "Blonde Girl with Over-Ear Headphones", desc: "Soft Lilac Circle • Peaceful listening pose" },
  { id: 13, name: "Young Boy Looking Up", desc: "Pastel Pink Circle • Curly crop & white tee" },
  { id: 14, name: "Pastel Bob Girl with Glasses", desc: "Peach Circle • Hand on chin, round glasses & bob" },
  { id: 15, name: "Girl in Forest Green Cap", desc: "Sky Blue Circle • Long wavy locks & dark hoodie" },
  { id: 16, name: "Laughing Curly Boy in Purple Hoodie", desc: "Mint Circle • Big joyful open laugh" }
];

// 2. Modular hairstyle showcase (Anchored & Proportioned)
const hairstyleLabels = [
  { id: "mohawk", name: "Faux-Hawk / Mohawk", desc: "Rooted wedge with temple fade (No air gap)" },
  { id: "waves", name: "Big Flowing Waves", desc: "Full mane + wavy bangs" },
  { id: "parted", name: "Clean Parted Fringe", desc: "Center parting + natural volume" },
  { id: "bob", name: "Soft Wavy Bob", desc: "Cheek-framing with bangs" },
  { id: "crop", name: "Textured Short Crop", desc: "Sporty low-profile spikes" },
  { id: "bun", name: "Chic Top Knot / Bun", desc: "Sleek compact bun + tie (Zero cone effect)" },
  { id: "beanie", name: "Fitted Knit Beanie", desc: "Low snug rib cap (Zero chimney dome)" },
  { id: "pompadour", name: "Modern Pompadour", desc: "Swept-back quiff wave" }
];

const hairShowcase = hairstyleLabels.map((h, i) => {
  const seeds = ["Aria", "Kai", "Maya", "Leo", "Zoe", "Sam", "Nina", "Finn"];
  return {
    ...h,
    avatar: createAvatar({
      seed: seeds[i],
      hair: h.id,
      size: 160,
      shape: "rounded"
    })
  };
});

// Build the HTML preview gallery with only Section 1 and Section 2 (everything below Section 2 removed)
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Craft Illustrated Avatars</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      padding: 48px 24px 64px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: background 0.3s ease, color 0.3s ease;
    }
    header {
      text-align: center;
      max-width: 800px;
      margin-bottom: 32px;
    }
    .badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.25);
      margin-bottom: 16px;
    }
    h1 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #38bdf8, #818cf8, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 16px;
      line-height: 1.6;
    }

    /* Section headers */
    .section-header {
      width: 100%;
      max-width: 1140px;
      margin: 40px 0 24px 0;
      text-align: left;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }

    /* Background Preview Switcher */
    .theme-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1e293b;
      padding: 8px 16px;
      border-radius: 14px;
      border: 1px solid #334155;
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 600;
    }
    .theme-btn {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: transform 0.15s, border-color 0.15s;
    }
    .theme-btn:hover {
      transform: scale(1.15);
    }
    .theme-btn.active {
      border-color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
    }
    .theme-dark { background: #0f172a; border-color: #475569; }
    .theme-slate { background: #334155; }
    .theme-light { background: #f8fafc; border-color: #cbd5e1; }
    .theme-checker {
      background-image: linear-gradient(45deg, #808080 25%, transparent 25%), 
                        linear-gradient(-45deg, #808080 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #808080 75%), 
                        linear-gradient(-45deg, transparent 75%, #808080 75%);
      background-size: 10px 10px;
      background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
      background-color: #ffffff;
    }

    /* Grid layout */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 28px;
      max-width: 1140px;
      width: 100%;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 24px;
      padding: 24px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .card:hover {
      transform: translateY(-6px);
      border-color: #64748b;
      box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6);
    }
    .pill-badge {
      font-size: 11px;
      padding: 3px 12px;
      border-radius: 9999px;
      background: #0f172a;
      color: #38bdf8;
      font-weight: 700;
      border: 1px solid #334155;
      margin-bottom: 14px;
    }
    .avatar-wrapper {
      margin-bottom: 16px;
      filter: drop-shadow(0 12px 24px rgba(0,0,0,0.35));
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 160px;
    }
    .avatar-wrapper img {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      display: block;
      transition: transform 0.25s ease;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
    .card:hover .avatar-wrapper img {
      transform: scale(1.05);
    }
    .avatar-wrapper svg {
      width: 160px;
      height: 160px;
      display: block;
      transition: transform 0.25s ease;
      shape-rendering: geometricPrecision;
    }
    .card:hover .avatar-wrapper svg {
      transform: scale(1.05);
    }
    .avatar-title {
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 4px;
      text-align: center;
    }
    .avatar-desc {
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.4;
      margin-bottom: 14px;
      min-height: 34px;
    }
    .seed-tag {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 6px;
      background: #0f172a;
      color: #94a3b8;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid #334155;
    }
    .links-bar {
      display: flex;
      gap: 8px;
      width: 100%;
      justify-content: center;
    }
    .link-btn {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 8px;
      background: #334155;
      color: #f1f5f9;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid #475569;
    }
    .link-btn:hover {
      background: #475569;
      border-color: #64748b;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">✨ Craft Avatar System</div>
    <h1>Craft Illustrated Avatars</h1>
    <p>16 distinct illustrated characters cropped into clean circular shapes with zero white halos and crisp inking, accompanied by modular proportioned vector hairstyles.</p>
  </header>

  <div class="theme-toolbar">
    <span>Preview Background:</span>
    <button class="theme-btn theme-dark active" onclick="setBg('#0f172a', '#f8fafc', this)" title="Dark Background"></button>
    <button class="theme-btn theme-slate" onclick="setBg('#1e293b', '#f8fafc', this)" title="Slate Background"></button>
    <button class="theme-btn theme-light" onclick="setBg('#f1f5f9', '#0f172a', this)" title="Light Background"></button>
    <button class="theme-btn theme-checker" onclick="setBg('checker', '#0f172a', this)" title="Transparent Grid Checkerboard"></button>
  </div>

  <!-- 1. All 16 Cropped Circular Illustrated Avatars -->
  <div class="section-header">
    <div class="section-title">🌟 16 Illustrated Circle Avatars (From Your Image)</div>
    <div class="section-subtitle">512×512 HD PNGs & SVGs • Transparent Circle Mask</div>
  </div>
  <div class="grid">
    ${illustratedList.map((item, idx) => {
      const meta = avatarMetadata[idx] || { name: "Avatar " + item.id, desc: "Circular Illustration" };
      return `
      <div class="card">
        <div class="pill-badge">Avatar #${item.id}</div>
        <div class="avatar-wrapper">
          <img src="avatars/avatar_${item.id}.png" alt="${meta.name}" loading="lazy" />
        </div>
        <div class="avatar-title">${meta.name}</div>
        <div class="avatar-desc">${meta.desc}</div>
        <div class="links-bar">
          <a class="link-btn" href="avatars/avatar_${item.id}.png" download title="Download 512x512 HD PNG">💾 PNG</a>
          <a class="link-btn" href="avatars/avatar_${item.id}.svg" target="_blank" title="Open Vector SVG">📄 SVG</a>
        </div>
      </div>
      `;
    }).join("")}
  </div>

  <!-- 2. Modular Vector Hairstyles (Anchored & Proportioned) -->
  <div class="section-header">
    <div class="section-title">💈 Modular Vector Hairstyles (Anchored & Proportioned)</div>
    <div class="section-subtitle">Zero floating gaps • Natural volume</div>
  </div>
  <div class="grid">
    ${hairShowcase.map(h => `
      <div class="card">
        <div class="avatar-wrapper">${h.avatar.svg}</div>
        <div class="avatar-title">${h.name}</div>
        <div class="avatar-desc">${h.desc}</div>
        <div class="seed-tag">seed: ${h.avatar.seed}</div>
      </div>
    `).join("")}
  </div>

  <script>
    function setBg(bg, textColor, el) {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      if (bg === 'checker') {
        document.body.style.background = '#e2e8f0';
        document.body.style.backgroundImage = 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)';
        document.body.style.backgroundSize = '20px 20px';
        document.body.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
        document.body.style.color = '#0f172a';
      } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.background = bg;
        document.body.style.color = textColor;
      }
    }
  </script>
</body>
</html>`;

await writeFile(new URL("./preview.html", import.meta.url), html, "utf8");
console.log("✔ Wrote examples/preview.html (showcase ending at Modular Vector Hairstyles)");
