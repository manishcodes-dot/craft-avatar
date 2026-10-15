const { ILLUSTRATED_AVATARS } = require("./illustrations.cjs");

const SHAPES = ["circle", "rounded", "square", "hexagon"];

// Authentic character skin tones
const SKIN_TONES = [
  "#FDDFC7", // 1. Warm Peach / Fair
  "#FCD0A1", // 2. Warm Honey
  "#E8B182", // 3. Golden Tan
  "#C68642", // 4. Bronze / Warm Brown
  "#8D5524", // 5. Deep Chocolate
  "#5A3319"  // 6. Rich Chestnut
];

// Vibrant character hair colors (including the signature bubblegum pink and mint from the illustration)
const HAIR_COLORS = [
  "#18181B", // Jet Black (Mohawk character)
  "#F472B6", // Bubblegum Pink (Wavy hair character)
  "#6EE7B7", // Pastel Mint (Glasses character)
  "#F59E0B", // Golden Blonde
  "#FFFFFF", // Platinum / White (Mullet character)
  "#C2410C", // Ginger Auburn
  "#818CF8", // Periwinkle Violet
  "#451A03"  // Deep Espresso
];

// Trendy clothing colors
const CLOTHING_COLORS = [
  "#818CF8", // Lilac / Violet (Left character sweater)
  "#78350F", // Deep Rust Brown (Top character sweater)
  "#047857", // Emerald Green
  "#E11D48", // Crimson Rose
  "#2563EB", // Royal Cobalt
  "#D97706", // Ochre Yellow
  "#334155"  // Charcoal Slate
];

// Vibrant solid background circles (matching the reference system)
const BG_COLORS = [
  "#FDE047", // Radiant Yellow (Top character)
  "#FCE7F3", // Soft Rose Pink (Left character)
  "#EDE9FE", // Lavender (Right character)
  "#FED7AA", // Warm Peach (Bottom character)
  "#CCFBF1", // Mint Ice
  "#BAE6FD"  // Sky Blue
];

const PALETTES = {
  ocean: ["#BAE6FD", "#2563EB", "#047857", "#1E3A8A", "#F0FDFA"],
  sunset: ["#FED7AA", "#E11D48", "#D97706", "#F97316", "#FFF7ED"],
  forest: ["#CCFBF1", "#047857", "#166534", "#22C55E", "#F0FDF4"],
  berry: ["#EDE9FE", "#F472B6", "#818CF8", "#C084FC", "#FDF4FF"],
  mono: ["#F1F5F9", "#18181B", "#334155", "#64748B", "#F8FAFC"],
  candy: ["#FCE7F3", "#F472B6", "#FDE047", "#818CF8", "#FFF1F2"]
};

let seedCounter = 0;

function generateRandomSeed() {
  seedCounter = (seedCounter + 1) >>> 0;
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  const time = Date.now().toString(36);
  const rand1 = Math.random().toString(36).slice(2, 10);
  const rand2 = Math.random().toString(36).slice(2, 10);
  return `sc-${time}-${rand1}-${rand2}-${seedCounter}`;
}

function hashString(input) {
  let hash = 0x811c9dc5;
  const str = String(input);
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createRandom(seed) {
  let value = hashString(seed) || 0x6d2b79f5;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, c => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;"
  })[c]);
}

const HEX_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function normalizeHex(hex) {
  if (typeof hex !== "string") return null;
  const match = hex.match(HEX_REGEX);
  if (!match) return null;
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
  }
  return hex.toUpperCase();
}

function shapeSvg(shape, size, fill, stroke = "none") {
  const inset = size * 0.02;
  const inner = size - inset * 2;
  const outline = stroke === "none" ? "" : ` stroke="${escapeXml(stroke)}" stroke-width="${Math.max(1, size * 0.018)}"`;
  if (shape === "circle") {
    return `<circle cx="${size / 2}" cy="${size / 2}" r="${inner / 2}" fill="${fill}"${outline}/>`;
  }
  if (shape === "hexagon") {
    const points = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${size / 2 + Math.cos(a) * inner / 2},${size / 2 + Math.sin(a) * inner / 2}`;
    }).join(" ");
    return `<polygon points="${points}" fill="${fill}"${outline}/>`;
  }
  return `<rect x="${inset}" y="${inset}" width="${inner}" height="${inner}" rx="${shape === "rounded" ? size * 0.22 : 0}" fill="${fill}"${outline}/>`;
}

/* =========================================================================
   PABLO STANLEY COMIC ILLUSTRATION STYLE ASSETS (Bold Black Inks & Shadows)
   ========================================================================= */

const INK = "#18181B"; // Crisp bold comic lineart

// 1. Back hair (renders behind shoulders & neck)
const HAIR_BACK = {
  // Voluminous Big Flowing Waves (Right character in reference)
  bigWaves: (c) => `
    <path d="M 50 78 C 30 100 24 140 40 180 C 48 195 62 195 66 175 C 60 145 62 110 68 84 Z 
             M 150 78 C 170 100 176 140 160 180 C 152 195 138 195 134 175 C 140 145 138 110 132 84 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 38 125 Q 32 150 44 175" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 162 125 Q 168 150 156 175" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  `,
  // Mullet / Back ponytail (Top character in reference)
  mullet: (c) => `
    <path d="M 84 95 C 80 120 80 148 90 154 L 110 154 C 120 148 120 120 116 95 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="95" y1="110" x2="94" y2="148" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="105" y1="110" x2="106" y2="148" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  `,
  // Full Bob Back (Bottom character in reference)
  bob: (c) => `
    <path d="M 52 80 C 44 110 46 142 66 156 C 58 128 60 100 66 82 Z 
             M 148 80 C 156 110 154 142 134 156 C 142 128 140 100 134 82 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  `
};

// 2. Clothing Styles (with crisp white collars like in reference)
const CLOTHING = [
  // A. Violet Sweater with crisp White Collar (Left character in reference)
  (c) => `
    <path d="M 32 200 C 38 150 66 140 84 140 L 100 160 L 116 140 C 134 140 162 150 168 200 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <polygon points="84,140 100,164 94,142" fill="#FFFFFF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="116,140 100,164 106,142" fill="#FFFFFF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  `,
  // B. Brown Crewneck with White Under-tee Collar (Top character in reference)
  (c) => `
    <path d="M 34 200 C 40 148 66 138 85 138 L 85 146 C 92 154 108 154 115 146 L 115 138 C 134 138 160 148 166 200 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 85 138 C 92 150 108 150 115 138 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  `,
  // C. Streetwear Hoodie with Drawstrings
  (c) => `
    <path d="M 32 200 C 38 146 66 136 82 134 C 88 146 112 146 118 134 C 134 136 162 146 168 200 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 82 134 C 90 150 110 150 118 134 C 112 156 88 156 82 134 Z" fill="rgba(0,0,0,0.16)"/>
    <line x1="94" y1="148" x2="94" y2="170" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="106" y1="148" x2="106" y2="170" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  `,
  // D. Athletic Zip-Up with White Piping
  (c) => `
    <path d="M 34 200 C 40 148 66 138 86 138 L 86 144 C 93 151 107 151 114 144 L 114 138 C 134 138 160 148 166 200 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="100" y1="146" x2="100" y2="200" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    <circle cx="100" cy="149" r="2.5" fill="#FFFFFF" stroke="${INK}" stroke-width="1.5"/>
  `
];

// 3. Iconic Graphic Neck Shadow (signature feature of the reference style!)
function renderNeck(skin) {
  return `
    <rect x="88" y="112" width="24" height="34" fill="${skin}" stroke="${INK}" stroke-width="3.5"/>
    <!-- Deep solid black chin shadow hugging the jaw -->
    <path d="M 88 114 C 94 130 106 130 112 114 L 112 128 C 105 138 95 138 88 128 Z" fill="${INK}"/>
  `;
}

// 4. Head, Jaw & Ears
function renderHead(skin) {
  return `
    <!-- Left Ear with cartilage detail -->
    <circle cx="67" cy="88" r="8" fill="${skin}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M 66 85 C 68 88 68 91 66 93" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>

    <!-- Right Ear with cartilage detail -->
    <circle cx="133" cy="88" r="8" fill="${skin}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M 134 85 C 132 88 132 91 134 93" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>

    <!-- Head Dome with stylized jawline -->
    <path d="M 68 82 C 68 46 132 46 132 82 C 132 116 116 130 100 130 C 84 130 68 116 68 82 Z" 
          fill="${skin}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  `;
}

// 5. Stylized Comic Eyes & Eyebrows
const EYES = [
  // A. Laughing Eye Slits (Left character in reference)
  () => `
    <path d="M 75 80 Q 84 73 93 80" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M 107 80 Q 116 73 125 80" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Eyebrows -->
    <path d="M 74 72 Q 84 68 92 72" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
    <path d="M 108 72 Q 116 68 126 72" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  `,
  // B. Bold Round Pupils with Catchlights (Bottom character in reference)
  () => `
    <circle cx="84" cy="81" r="5.5" fill="${INK}"/>
    <circle cx="85.5" cy="79.5" r="1.8" fill="#FFFFFF"/>
    <circle cx="116" cy="81" r="5.5" fill="${INK}"/>
    <circle cx="117.5" cy="79.5" r="1.8" fill="#FFFFFF"/>
    <!-- Eyebrows -->
    <path d="M 75 72 Q 84 67 93 72" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
    <path d="M 107 72 Q 116 67 125 72" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  `,
  // C. Joyful Eyes with Upper Lashes (Right character in reference)
  () => `
    <path d="M 75 81 Q 84 75 93 81" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M 107 81 Q 116 75 125 81" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Stylized Lashes/Brows -->
    <path d="M 74 71 Q 84 66 92 72" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M 108 72 Q 116 66 126 71" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <line x1="77" y1="76" x2="75" y2="73" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <line x1="123" y1="76" x2="125" y2="73" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  `,
  // D. Playful Wink
  () => `
    <circle cx="84" cy="81" r="5.5" fill="${INK}"/>
    <circle cx="85.5" cy="79.5" r="1.8" fill="#FFFFFF"/>
    <path d="M 107 81 Q 116 87 125 81" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M 75 72 Q 84 67 93 72" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
    <path d="M 107 70 Q 116 65 125 70" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  `
];

// 6. Distinct Comic Mouths (Directly matching the reference image)
const MOUTHS = [
  // 1. Big Laughing Open Mouth with Pink Tongue (Left character in reference)
  () => `
    <path d="M 86 104 C 86 120 114 120 114 104 Z" fill="${INK}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
    <!-- Pink Tongue -->
    <path d="M 92 113 C 96 108 104 108 108 113 C 104 120 96 120 92 113 Z" fill="#F43F5E"/>
  `,
  // 2. Clenched Teeth / Grit Expression (Top character in reference)
  () => `
    <rect x="86" y="102" width="28" height="14" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
    <line x1="100" y1="102" x2="100" y2="116" stroke="${INK}" stroke-width="2.5"/>
    <line x1="93" y1="102" x2="93" y2="116" stroke="${INK}" stroke-width="2"/>
    <line x1="107" y1="102" x2="107" y2="116" stroke="${INK}" stroke-width="2"/>
  `,
  // 3. Cute Pouting / Kissing Lips "3" (Right character in reference)
  () => `
    <path d="M 98 102 Q 94 106 98 109 Q 94 113 98 116" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  `,
  // 4. Confident Comic Grin with Teeth
  () => `
    <path d="M 88 104 Q 100 118 112 104 Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 91 104 Q 100 109 109 104 Z" fill="#FFFFFF"/>
  `,
  // 5. Classic Gentle Smile
  () => `
    <path d="M 91 106 Q 100 116 109 106" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  `
];

// 7. Diverse Comic Hairstyles (Firmly anchored to skull, zero floating gaps, sleek natural volume)
const HAIRSTYLES = [
  // Style 1: Faux-Hawk / Mohawk with High Fade (Left character in reference) - 100% Rooted, No Gap
  (c) => `
    <!-- High Fade / Temple Stipple strictly on head surface -->
    <path d="M 68 80 C 68 68 72 62 78 64 L 78 80 Z" fill="rgba(0,0,0,0.14)"/>
    <path d="M 68 80 C 68 68 72 62 78 64" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Rooted Faux-Hawk: starts at forehead y=64, crests at y=34, overlaps skull dome (apex y=55) seamlessly -->
    <path d="M 78 64 C 76 46 84 34 94 34 C 102 34 114 36 122 46 C 126 52 128 58 126 62 
             C 114 62 98 62 78 64 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="94" y1="38" x2="94" y2="52" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="104" y1="38" x2="104" y2="52" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="114" y1="42" x2="114" y2="56" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  `,

  // Style 2: Big Flowing Voluminous Waves (Right character in reference - Bubblegum Pink)
  (c) => `
    <!-- Unified crown & wavy bangs - completely frames head, zero detached pieces -->
    <path d="M 66 82 C 60 50 72 36 100 36 C 128 36 140 50 134 82 
             C 128 72 122 64 112 64 C 104 64 102 68 100 70 C 98 68 96 64 88 64 C 78 64 72 72 66 82 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <!-- Wave texture & flow lines -->
    <path d="M 80 42 Q 74 56 72 74" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 120 42 Q 126 56 128 74" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 100 40 L 100 62" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  `,

  // Style 3: Clean Parted Fringe with Shaggy Mullet (Top character in reference)
  (c) => `
    <path d="M 66 80 C 62 52 74 42 100 42 C 126 42 138 52 134 80 
             C 128 66 120 62 108 63 C 102 64 100 68 100 72 C 100 68 98 64 92 63 C 80 62 72 66 66 80 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <!-- Center parting line -->
    <line x1="100" y1="42" x2="100" y2="60" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 80 48 Q 75 60 72 72" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 120 48 Q 125 60 128 72" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
  `,

  // Style 4: Soft Wavy Bob with Side Bangs (Bottom character in reference)
  (c) => `
    <path d="M 60 110 C 54 84 58 44 76 36 C 88 32 112 32 124 36 C 142 44 146 84 140 110 
             C 134 94 132 72 122 66 C 112 60 98 60 86 64 C 76 68 70 82 66 98 C 64 104 62 108 60 110 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 86 46 Q 98 52 114 56" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 68 70 Q 64 88 66 102" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 132 70 Q 136 88 134 102" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
  `,

  // Style 5: Textured Short Crop / Casual Spikes (Sporty, low-profile)
  (c) => `
    <path d="M 66 80 C 62 60 66 42 76 36 C 84 32 94 30 100 30 C 106 30 116 32 124 36 C 134 42 138 60 134 80 
             C 130 68 124 64 116 64 C 110 67 106 63 100 64 C 94 63 90 67 84 64 C 76 64 70 68 66 80 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="88" y1="38" x2="86" y2="52" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="100" y1="34" x2="100" y2="48" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="112" y1="38" x2="114" y2="52" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  `,

  // Style 6: Chic Top Knot / Sleek Bun (Neat round knot, NO cone/chimney effect)
  (c) => `
    <!-- Sleek slicked-back base hugging the skull -->
    <path d="M 66 80 C 62 56 68 44 100 44 C 132 44 138 56 134 80 
             C 130 68 122 64 100 64 C 78 64 70 68 66 80 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <!-- Cute compact round knot right on crown -->
    <circle cx="100" cy="33" r="11" fill="${c}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M 95 31 Q 100 27 105 31" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Hair tie band -->
    <rect x="92" y="42" width="16" height="5" rx="2.5" fill="#F43F5E" stroke="${INK}" stroke-width="2"/>
    <!-- Slicked back hair flow lines -->
    <path d="M 82 60 Q 88 50 94 46" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 118 60 Q 112 50 106 46" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
  `,

  // Style 7: Low-Profile Fitted Knit Beanie (Snug and cozy, NO tall stovepipe dome)
  (c) => `
    <!-- Hair peeking out beneath beanie at temples -->
    <path d="M 64 68 C 62 74 62 82 66 82 C 68 78 68 72 64 68 Z 
             M 136 68 C 138 74 138 82 134 82 C 132 78 132 72 136 68 Z" fill="#18181B"/>
    <!-- Beanie Dome: snug low curve (top y=38, only 17px height!) -->
    <path d="M 66 56 C 64 36 136 36 134 56 Z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <!-- Beanie Turn-Up Cuff -->
    <rect x="62" y="56" width="76" height="12" rx="4" fill="${c}" stroke="${INK}" stroke-width="3.5"/>
    <!-- Knit ribbing lines -->
    <line x1="75" y1="57" x2="75" y2="67" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <line x1="87" y1="57" x2="87" y2="67" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <line x1="100" y1="57" x2="100" y2="67" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <line x1="113" y1="57" x2="113" y2="67" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <line x1="125" y1="57" x2="125" y2="67" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  `,

  // Style 8: Modern Pompadour / Quiff (Sleek swept-back wave)
  (c) => `
    <path d="M 66 80 C 62 58 66 38 78 32 C 86 28 98 28 106 28 C 116 30 126 34 134 46 C 136 58 136 70 134 80 
             C 128 66 120 62 108 63 C 98 62 88 62 78 63 C 72 63 68 68 66 80 Z" 
          fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 80 44 C 88 36 98 34 110 34" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 86 52 C 94 44 106 42 118 42" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  `
];

// 8. Accessories (Matching the reference: big gold hoops, round wire glasses)
const ACCESSORIES = [
  // None
  () => "",

  // Big Bold Gold Hoop Earring (Right character in reference!)
  () => `
    <circle cx="62" cy="98" r="10" fill="none" stroke="#FBBF24" stroke-width="3.8"/>
  `,

  // Round Black Comic Glasses (Bottom character in reference!)
  () => `
    <circle cx="83" cy="81" r="13" fill="none" stroke="${INK}" stroke-width="3.5"/>
    <circle cx="117" cy="81" r="13" fill="none" stroke="${INK}" stroke-width="3.5"/>
    <line x1="96" y1="81" x2="104" y2="81" stroke="${INK}" stroke-width="3.5"/>
    <line x1="68" y1="78" x2="70" y2="78" stroke="${INK}" stroke-width="3"/>
    <line x1="130" y1="78" x2="132" y2="78" stroke="${INK}" stroke-width="3"/>
  `,

  // Both Gold Hoop & Round Glasses!
  () => `
    <circle cx="62" cy="98" r="10" fill="none" stroke="#FBBF24" stroke-width="3.8"/>
    <circle cx="83" cy="81" r="13" fill="none" stroke="${INK}" stroke-width="3.5"/>
    <circle cx="117" cy="81" r="13" fill="none" stroke="${INK}" stroke-width="3.5"/>
    <line x1="96" y1="81" x2="104" y2="81" stroke="${INK}" stroke-width="3.5"/>
  `
];

const HAIRSTYLE_NAMES = ["mohawk", "waves", "parted", "bob", "crop", "bun", "beanie", "pompadour"];

function normalize(options = {}, isRandomMode = false) {
  if (typeof options === "string" || typeof options === "number") {
    options = { seed: String(options) };
  } else if (!options || typeof options !== "object") {
    options = {};
  }

  const isRandom = isRandomMode || Boolean(options.randomize);

  const seed = (options.seed !== undefined && options.seed !== null && String(options.seed).trim().length > 0)
    ? String(options.seed)
    : generateRandomSeed();

  const size = Number.isFinite(options.size) ? Math.round(options.size) : 128;
  if (size < 16 || size > 1024) throw new RangeError("size must be between 16 and 1024");

  let shape = options.shape;
  if (!shape) {
    shape = isRandom
      ? SHAPES[Math.floor(Math.random() * SHAPES.length)]
      : "circle";
  } else if (!SHAPES.includes(shape)) {
    throw new TypeError(`shape must be one of: ${SHAPES.join(", ")}`);
  }

  const paletteNames = Object.keys(PALETTES);
  let palette = options.palette;
  if (!palette) {
    palette = isRandom
      ? paletteNames[Math.floor(Math.random() * paletteNames.length)]
      : "ocean";
  } else if (!PALETTES[palette] && !Array.isArray(options.colors)) {
    throw new TypeError(`Unknown palette "${palette}". Choose: ${paletteNames.join(", ")}`);
  }

  let colors;
  if (Array.isArray(options.colors)) {
    colors = options.colors.map(normalizeHex);
    if (colors.length < 2 || colors.some(c => c === null)) {
      throw new TypeError("colors must contain at least two valid hex colors (#RGB, #RRGGBB, or #RRGGBBAA)");
    }
  } else {
    colors = PALETTES[palette];
  }

  if (options.density !== undefined && options.density !== null) {
    if (!Number.isInteger(options.density) || options.density < 2 || options.density > 8) {
      throw new RangeError("density must be an integer from 2 to 8");
    }
  }

  return {
    seed,
    size,
    shape,
    palette,
    colors,
    density: options.density,
    background: options.background,
    hair: options.hair,
    mode: options.mode,
    illustrated: options.illustrated,
    stroke: options.stroke ?? "none",
    label: options.label ?? ""
  };
}

/**
 * Render an avatar in the requested Pablo Stanley Comic Illustration style.
 */
function renderAvatar(o) {
  const rand = createRandom(o.seed);

  // Deterministic choices
  const skin = SKIN_TONES[Math.floor(rand() * SKIN_TONES.length)];
  const hairColor = HAIR_COLORS[Math.floor(rand() * HAIR_COLORS.length)];
  const clothColor = CLOTHING_COLORS[Math.floor(rand() * CLOTHING_COLORS.length)];

  // Background circle color
  let bg = o.background;
  if (!bg) {
    bg = o.colors && o.colors.length > 0
      ? o.colors[0]
      : BG_COLORS[Math.floor(rand() * BG_COLORS.length)];
  }

  let hairIndex;
  if (typeof o.hair === "number" && o.hair >= 0 && o.hair < HAIRSTYLES.length) {
    hairIndex = o.hair;
  } else if (typeof o.hair === "string" && HAIRSTYLE_NAMES.includes(o.hair.toLowerCase())) {
    hairIndex = HAIRSTYLE_NAMES.indexOf(o.hair.toLowerCase());
  } else {
    hairIndex = Math.floor(rand() * HAIRSTYLES.length);
  }

  const eyeIndex = Math.floor(rand() * EYES.length);
  const mouthIndex = Math.floor(rand() * MOUTHS.length);
  const clothIndex = Math.floor(rand() * CLOTHING.length);
  const accIndex = Math.floor(rand() * ACCESSORIES.length);

  // Back hair layer
  const backHair = hairIndex === 1
    ? HAIR_BACK.bigWaves(hairColor)
    : (hairIndex === 2 ? HAIR_BACK.mullet(hairColor) : (hairIndex === 3 ? HAIR_BACK.bob(hairColor) : ""));

  const clothesSvg = CLOTHING[clothIndex](clothColor);
  const neckSvg = renderNeck(skin);
  const headSvg = renderHead(skin);

  // Cute comic hook nose
  const noseSvg = `<path d="M 98 88 L 101 96 C 104 96 104 93 102 93" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

  const eyesSvg = EYES[eyeIndex]();
  const mouthSvg = MOUTHS[mouthIndex]();
  const frontHair = HAIRSTYLES[hairIndex](hairColor);
  const accSvg = ACCESSORIES[accIndex]();

  const clipId = `sc-clip-${hashString(o.seed + ":" + o.size + ":" + o.shape).toString(36)}`;
  const s = o.size;
  const label = o.label ? ` role="img" aria-label="${escapeXml(o.label)}"` : ` aria-hidden="true"`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 200 200"${label}><defs><clipPath id="${clipId}">${shapeSvg(o.shape, 200, "#fff")}</clipPath></defs><g clip-path="url(#${clipId})">${shapeSvg(o.shape, 200, bg)}${backHair}${neckSvg}${clothesSvg}${headSvg}${noseSvg}${eyesSvg}${mouthSvg}${frontHair}${accSvg}</g>${o.stroke === "none" ? "" : shapeSvg(o.shape, 200, "none", o.stroke)}</svg>`;

  return {
    seed: o.seed,
    size: s,
    svg,
    dataUri: toDataUri(svg),
    palette: o.palette,
    shape: o.shape,
    colors: [bg, skin, hairColor, clothColor]
  };
}

function createAvatar(options = {}) {
  const o = normalize(options, false);
  if (o.mode === "illustration" || o.illustrated) {
    const item = getIllustratedAvatar(o.seed);
    const s = o.size;
    const clipId = `sc-clip-${hashString(o.seed + ":" + s).toString(36)}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 200 200" role="img" aria-label="Illustrated avatar"><defs><clipPath id="${clipId}"><circle cx="100" cy="100" r="100"/></clipPath></defs><image href="${item.dataUri}" width="200" height="200" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/></svg>`;
    return {
      seed: o.seed,
      size: s,
      svg,
      dataUri: toDataUri(svg),
      palette: "illustration",
      shape: "circle",
      colors: []
    };
  }
  return renderAvatar(o);
}

function randomAvatar(options = {}) {
  const o = normalize(options, true);
  return renderAvatar(o);
}

function generateAvatars(count = 10, options = {}) {
  if (!Number.isInteger(count) || count < 1 || count > 10000) {
    throw new RangeError("count must be an integer between 1 and 10000");
  }
  const seenSeeds = new Set();
  const results = [];

  for (let i = 0; i < count; i++) {
    let seed;
    do {
      seed = generateRandomSeed();
    } while (seenSeeds.has(seed));

    seenSeeds.add(seed);
    results.push(randomAvatar({ ...options, seed }));
  }

  return results;
}

class AvatarPool {
  constructor(options = {}) {
    this.options = { ...options };
    this.seenSeeds = new Set();
  }

  next(overrideOptions = {}) {
    let seed;
    do {
      seed = generateRandomSeed();
    } while (this.seenSeeds.has(seed));
    this.seenSeeds.add(seed);

    return randomAvatar({
      ...this.options,
      ...overrideOptions,
      seed
    });
  }

  generate(count, overrideOptions = {}) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(this.next(overrideOptions));
    }
    return list;
  }

  clear() {
    this.seenSeeds.clear();
  }

  get size() {
    return this.seenSeeds.size;
  }
}

function createAvatarPool(options = {}) {
  return new AvatarPool(options);
}

function avatarUrl(options = {}) {
  return createAvatar(options).dataUri;
}

function avatarSvg(options = {}) {
  return createAvatar(options).svg;
}

function getPalettes() {
  return Object.fromEntries(Object.entries(PALETTES).map(([k, v]) => [k, [...v]]));
}

function getShapes() {
  return [...SHAPES];
}

function getHairstyles() {
  return [...HAIRSTYLE_NAMES];
}



function getIllustratedAvatars() {
  return ILLUSTRATED_AVATARS;
}

function getIllustratedAvatar(idOrSeed = 1) {
  if (typeof idOrSeed === "number") {
    const idx = ((Math.floor(idOrSeed) - 1) % ILLUSTRATED_AVATARS.length + ILLUSTRATED_AVATARS.length) % ILLUSTRATED_AVATARS.length;
    return ILLUSTRATED_AVATARS[idx];
  }
  const hash = Math.abs(hashString(String(idOrSeed)));
  return ILLUSTRATED_AVATARS[hash % ILLUSTRATED_AVATARS.length];
}

getIllustratedAvatar.url = (idOrSeed = 1) => getIllustratedAvatar(idOrSeed).dataUri;
getIllustratedAvatar.svg = (idOrSeed = 1) => getIllustratedAvatar(idOrSeed).svg;
getIllustratedAvatar.all = () => ILLUSTRATED_AVATARS;

function toDataUri(svg) {
  if (typeof svg !== "string" || !svg.trim().startsWith("<svg")) {
    throw new TypeError("Expected SVG markup");
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function autoApply(root) {
  const container = root || (typeof document !== "undefined" ? document : null);
  if (!container || typeof container.querySelectorAll !== "function") return;

  // 1. Elements with data-avatar="seed"
  const avatarEls = container.querySelectorAll("[data-avatar]");
  for (let i = 0; i < avatarEls.length; i++) {
    const el = avatarEls[i];
    const seed = el.getAttribute("data-avatar") || el.getAttribute("data-seed") || "";
    const shape = el.getAttribute("data-shape") || undefined;
    const size = parseInt(el.getAttribute("data-size"), 10) || undefined;
    const palette = el.getAttribute("data-palette") || undefined;
    const isIllustrated = el.hasAttribute("data-illustrated");

    const res = isIllustrated
      ? getIllustratedAvatar(seed || 1)
      : createAvatar({ seed, shape, size, palette });

    if (el.tagName === "IMG") {
      el.src = res.dataUri;
    } else {
      el.innerHTML = res.svg;
    }
  }

  // 2. Elements with data-avatar-illustrated="1" or "seed"
  const illEls = container.querySelectorAll("[data-avatar-illustrated]");
  for (let i = 0; i < illEls.length; i++) {
    const el = illEls[i];
    const val = el.getAttribute("data-avatar-illustrated");
    const num = parseInt(val, 10);
    const idOrSeed = !isNaN(num) && String(num) === val ? num : (val || 1);
    const res = getIllustratedAvatar(idOrSeed);

    if (el.tagName === "IMG") {
      el.src = res.dataUri;
    } else {
      el.innerHTML = res.svg;
    }
  }
}

// Axios-style object composition on default export
createAvatar.create = createAvatar;
createAvatar.random = randomAvatar;
createAvatar.generate = generateAvatars;
createAvatar.pool = createAvatarPool;
createAvatar.url = avatarUrl;
createAvatar.svg = avatarSvg;
createAvatar.illustration = getIllustratedAvatar;
createAvatar.illustrations = ILLUSTRATED_AVATARS;
createAvatar.getIllustratedAvatar = getIllustratedAvatar;
createAvatar.getIllustratedAvatars = getIllustratedAvatars;
createAvatar.palettes = getPalettes;
createAvatar.shapes = getShapes;
createAvatar.hairstyles = getHairstyles;
createAvatar.toDataUri = toDataUri;
createAvatar.auto = autoApply;

// Browser auto-initialization (CDN / unpkg / script tag)
if (typeof window !== "undefined") {
  window.avatar = createAvatar;
  window.CraftAvatar = createAvatar;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => autoApply());
    } else {
      autoApply();
    }
  }
}



module.exports = createAvatar;
module.exports.default = createAvatar;
module.exports.createAvatar = createAvatar;
module.exports.randomAvatar = randomAvatar;
module.exports.generateAvatars = generateAvatars;
module.exports.AvatarPool = AvatarPool;
module.exports.createAvatarPool = createAvatarPool;
module.exports.avatarUrl = avatarUrl;
module.exports.avatarSvg = avatarSvg;
module.exports.getPalettes = getPalettes;
module.exports.getShapes = getShapes;
module.exports.getHairstyles = getHairstyles;
module.exports.ILLUSTRATED_AVATARS = ILLUSTRATED_AVATARS;
module.exports.getIllustratedAvatars = getIllustratedAvatars;
module.exports.getIllustratedAvatar = getIllustratedAvatar;
module.exports.toDataUri = toDataUri;
module.exports.autoApply = autoApply;
module.exports.PALETTES = PALETTES;
module.exports.SHAPES = SHAPES;
module.exports.SKIN_TONES = SKIN_TONES;
module.exports.HAIR_COLORS = HAIR_COLORS;
module.exports.CLOTHING_COLORS = CLOTHING_COLORS;
module.exports.BG_COLORS = BG_COLORS;
module.exports.generateRandomSeed = generateRandomSeed;
module.exports.hashString = hashString;
