<div align="center">

# ✨ Craft Avatar

### A lightweight, zero-dependency avatar library for JavaScript, TypeScript, and React.
**Generate deterministic identicons from usernames, bulk unique session avatars, or use 16 curated high-definition illustrated characters.**

[![npm version](https://img.shields.io/npm/v/craft-avatar.svg?style=flat-square&color=38bdf8)](https://www.npmjs.com/package/craft-avatar)
[![npm downloads](https://img.shields.io/npm/dm/craft-avatar.svg?style=flat-square&color=818cf8)](https://www.npmjs.com/package/craft-avatar)
[![License: MIT](https://img.shields.io/badge/license-MIT-f472b6.svg?style=flat-square)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-10b981.svg?style=flat-square)](https://www.npmjs.com/package/craft-avatar)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Ready-3b82f6.svg?style=flat-square)](src/index.d.ts)
[![Tests Passing](https://img.shields.io/badge/tests-13%20passed-success.svg?style=flat-square)](test/index.test.js)

[Quick Start](#-quick-start) • [16 Illustrated Characters](#-16-hand-drawn-illustrated-characters) • [HTML Auto-Apply](#-html--cdn-auto-apply-zero-javascript) • [React Component](#️-react-component) • [API Reference](#-api-reference)

</div>

---

## 🌟 Why Craft Avatar?

Most avatar libraries either require external network requests to third-party CDNs (causing latency and privacy concerns) or generate boring, robotic pixel blocks.

**Craft Avatar** solves this by running **100% locally in-memory** with zero dependencies, offering both procedural identicons and hand-drawn illustrated characters.

- **⚡ Zero External Network Calls**: Generates pure SVG and data URIs instantly in-memory (< 5 KB). Completely offline, fast, and private.
- **🎨 16 Curated Hand-Drawn Characters**: Ready-to-use, high-definition ($512\times 512\text{ px}$) circular avatars with crisp inking and transparent backgrounds.
- **🚀 Axios-Style Callable API**: Call `avatar("username")` directly in one line of code without complex configuration objects.
- **🌐 Zero-Setup HTML Auto-Hydration**: Drop in a `<script>` tag and write `<img data-avatar="username" />`—it populates automatically on page load.
- **🔒 Deterministic Identicons**: Passing the same username or email always renders the exact same character every time.
- **🔄 Session Uniqueness Pool**: Built-in `avatar.pool()` guarantees zero duplicate avatars across user lists and sessions.
- **⚛️ Built-in React Component**: Drop-in `<Avatar />` component with memoized seeds and inline SVG support.

---

## 📦 Installation

Install with your preferred package manager:

```bash
# npm
npm install craft-avatar

# pnpm
pnpm add craft-avatar

# yarn
yarn add craft-avatar
```

Or use directly in your browser without installing via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/craft-avatar"></script>
```

---

## 🚀 Quick Start

### 1. Call `avatar` Directly (Like Axios — 1 Line of Code)

Works in both **ESM** and **CommonJS**:

```javascript
import avatar from "craft-avatar";
// or CommonJS: const avatar = require("craft-avatar");

// Generate an avatar from any username, ID, or email:
const user = avatar("manish");

console.log(user.dataUri); // "data:image/svg+xml;..." (ready for <img src="..." />)
console.log(user.svg);     // "<svg>...</svg>" (raw SVG markup)
console.log(user.seed);    // "manish"

// Need just the image URL directly for an <img src="..." />?
const imageUrl = avatar.url("manish");
```

---

## 🎨 16 Hand-Drawn Illustrated Characters

Craft Avatar includes **16 high-definition ($512 \times 512\text{ px}$)**, hand-drawn circular character avatars with transparent backgrounds, crisp black ink lines (`#18181B`), and zero white halos.

```javascript
import avatar from "craft-avatar";

// 1. Pick a character by ID (1 to 16):
const character = avatar.illustration(1);
console.log(character.dataUri); // 512x512 HD circular transparent PNG
console.log(character.svg);     // Vector SVG markup

// 2. Or get an avatar deterministically mapped from a username:
const userCharacter = avatar.illustration("alice");

// 3. Direct URL helper for <img src="..." />:
const imgUrl = avatar.illustration.url(1); // or avatar.illustration.url("manish")

// 4. Access all 16 illustrated avatars:
console.log(avatar.illustrations);
```

---

## 🌐 HTML / CDN Auto-Apply (Zero JavaScript!)

Just drop the script tag into your HTML. Mention `data-avatar` on any element, and it is **applied automatically on page load**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Load Craft Avatar from global CDN -->
  <script src="https://cdn.jsdelivr.net/npm/craft-avatar"></script>
</head>
<body>

  <!-- Automatically populates with a procedural avatar based on seed -->
  <img data-avatar="manish" alt="Manish" />
  <img data-avatar="alice" data-shape="circle" data-size="96" />

  <!-- Automatically populates with Illustrated Avatar #1 from the curated artwork -->
  <img data-avatar-illustrated="1" alt="Avatar 1" />
  <img data-avatar-illustrated="4" alt="Avatar 4" />

  <!-- Injects raw SVG inside any container -->
  <div data-avatar="charlie"></div>

</body>
</html>
```

*(For dynamically created DOM elements, call `avatar.auto()` anytime).*

---

## ⚛️ React Component

React is an optional peer dependency:

```bash
npm install craft-avatar react
```

```jsx
import { Avatar } from "craft-avatar/react";

export function TeamList() {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      {/* 1. Curated illustrated artwork character: */}
      <Avatar illustration={1} size={64} alt="Avatar 1" />

      {/* 2. Deterministic vector avatar from username: */}
      <Avatar seed="manish" shape="circle" size={64} />

      {/* 3. With custom palette & shape: */}
      <Avatar seed="alice" palette="sunset" shape="rounded" size={64} />

      {/* 4. Instant random non-duplicate avatar: */}
      <Avatar size={64} />

      {/* 5. Render as inline SVG instead of <img> tag: */}
      <Avatar seed="bob" as="svg" size={64} />
    </div>
  );
}
```

---

## 🎲 Advanced Generator Features

### A. Bulk Generation (e.g. for User Lists)
Guaranteed **0 duplicate avatars** across the entire batch:
```javascript
import avatar from "craft-avatar";

const team = avatar.generate(25, { size: 96 });
team.forEach(member => {
  console.log(member.seed, member.dataUri);
});
```

### B. Session Uniqueness Pool (`AvatarPool`)
Guarantees that no two calls ever produce the same avatar during a user session or server lifecycle:
```javascript
import avatar from "craft-avatar";

const pool = avatar.pool();

const user1 = pool.next();
const user2 = pool.next();
console.log(user1.seed !== user2.seed); // true (always unique)
```

### C. Customization Options
```javascript
const custom = avatar({
  seed: "manish",
  size: 160,
  palette: "forest",     // "ocean" | "sunset" | "forest" | "berry" | "mono" | "candy"
  shape: "circle",       // "circle" | "rounded" | "square" | "hexagon"
  hair: "pompadour",     // "mohawk" | "waves" | "parted" | "bob" | "crop" | "bun" | "beanie" | "pompadour"
  colors: ["#BAE6FD", "#2563EB"], // Or custom hex colors (#RGB, #RRGGBB, #RRGGBBAA)
  stroke: "#18181B",     // Optional border outline
  label: "Manish profile avatar"
});
```

---

## 📖 API Reference

### `avatar(options?)`
Primary callable function. Returns `AvatarResult`.
* **`options`** (`string | number | AvatarOptions`): Seed string, number, or configuration object.

### Attached Helpers:
* **`avatar.url(options?)`** $\rightarrow$ `string`: Returns the `dataUri` string directly (ideal for `<img src={...} />`).
* **`avatar.svg(options?)`** $\rightarrow$ `string`: Returns the raw SVG code string.
* **`avatar.random(options?)`** $\rightarrow$ `AvatarResult`: Generates a unique, non-duplicate random avatar.
* **`avatar.generate(count, options?)`** $\rightarrow$ `AvatarResult[]`: Bulk generates `count` unique avatars.
* **`avatar.pool(options?)`** $\rightarrow$ `AvatarPool`: Creates a session uniqueness pool.
* **`avatar.illustration(idOrSeed)`** $\rightarrow$ `IllustratedAvatarItem`: Retrieves one of the 16 curated artwork characters.
* **`avatar.illustration.url(idOrSeed)`** $\rightarrow$ `string`: Direct data URI for an illustrated character.
* **`avatar.illustration.svg(idOrSeed)`** $\rightarrow$ `string`: Direct SVG markup for an illustrated character.
* **`avatar.illustrations`** $\rightarrow$ `IllustratedAvatarItem[]`: Array of all 16 illustrated characters.
* **`avatar.auto(rootElement?)`** $\rightarrow$ `void`: Scans the DOM and hydrates `[data-avatar]` elements.
* **`avatar.palettes()`** $\rightarrow$ `Record<string, string[]>`: Available color palettes.
* **`avatar.shapes()`** $\rightarrow$ `string[]`: Supported shapes (`circle`, `rounded`, `square`, `hexagon`).
* **`avatar.hairstyles()`** $\rightarrow$ `string[]`: Supported hairstyles.

---

## 🛠️ TypeScript Support

Craft Avatar is built with full TypeScript type definitions out of the box:

```typescript
import avatar, { AvatarOptions, AvatarResult, IllustratedAvatarItem } from "craft-avatar";

const options: AvatarOptions = {
  seed: "manish",
  shape: "circle",
  palette: "sunset"
};

const result: AvatarResult = avatar(options);
```

---

## 🧪 Testing

Craft Avatar uses Node.js's built-in native test runner:

```bash
# Run unit tests
npm test

# Build CJS, ESM, and browser bundles
npm run build
```

---

## 📄 License

[MIT](LICENSE) © [Craft Avatar contributors](LICENSE)