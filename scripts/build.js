import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

await mkdir("dist", { recursive: true });

console.log("Building CommonJS & Browser artifacts...");

// 1. Build src/illustrations.cjs
const illEsm = await readFile("src/illustrations.js", "utf8");
const illCjs = illEsm
  .replace("export const ILLUSTRATED_AVATARS = [", "const ILLUSTRATED_AVATARS = [")
  .replace("export default ILLUSTRATED_AVATARS;", "module.exports = { ILLUSTRATED_AVATARS, default: ILLUSTRATED_AVATARS };");
await writeFile("src/illustrations.cjs", illCjs, "utf8");
console.log("✔ Built src/illustrations.cjs");

// 2. Build src/index.cjs
const indexEsm = await readFile("src/index.js", "utf8");
let indexCjs = indexEsm
  .replace('import { ILLUSTRATED_AVATARS } from "./illustrations.js";', 'const { ILLUSTRATED_AVATARS } = require("./illustrations.cjs");')
  .replace(/export (const|let|function|class) /g, "$1 ")
  .replace(/export \{[^}]+\};/g, "")
  .replace("export default createAvatar;", "");

indexCjs += `
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
`;

await writeFile("src/index.cjs", indexCjs, "utf8");
console.log("✔ Built src/index.cjs");

// 3. Build dist/craft-avatar.min.js (Self-contained IIFE for browsers & CDNs)
// Inlines illustrations and index logic inside an IIFE
const illDataPart = illEsm.replace("export default ILLUSTRATED_AVATARS;", "");
const indexBundleBody = indexEsm
  .replace('import { ILLUSTRATED_AVATARS } from "./illustrations.js";', "")
  .replace(/export (const|let|function|class) /g, "$1 ")
  .replace(/export \{[^}]+\};/g, "")
  .replace("export default createAvatar;", "");

const browserBundle = `(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.avatar = factory(), global.CraftAvatar = global.avatar));
})(this, (function() {
  'use strict';
  ${illDataPart}
  ${indexBundleBody}
  return createAvatar;
}));`;

await writeFile("dist/craft-avatar.min.js", browserBundle, "utf8");
console.log("✔ Built dist/craft-avatar.min.js (UMD / CDN ready)");
console.log("All artifacts built successfully!");
