import test from "node:test";
import assert from "node:assert/strict";
import {
  createAvatar,
  randomAvatar,
  generateAvatars,
  createAvatarPool,
  avatarUrl,
  getPalettes,
  getShapes,
  toDataUri,
  generateRandomSeed
} from "../src/index.js";

test("same seed produces deterministic SVG", () => {
  const a1 = createAvatar({ seed: "alice" });
  const a2 = createAvatar({ seed: "alice" });
  assert.equal(a1.svg, a2.svg);
  assert.equal(a1.seed, "alice");
});

test("passing string directly works as seed", () => {
  const a1 = createAvatar("alice");
  const a2 = createAvatar({ seed: "alice" });
  assert.equal(a1.svg, a2.svg);
});

test("calling createAvatar without seed generates random, non-duplicate avatars", () => {
  const a1 = createAvatar();
  const a2 = createAvatar();
  assert.notEqual(a1.seed, a2.seed);
  assert.notEqual(a1.svg, a2.svg);
});

test("randomAvatar creates diverse shapes and palettes without duplicates", () => {
  const avatars = Array.from({ length: 10 }, () => randomAvatar());
  const seeds = new Set(avatars.map(a => a.seed));
  assert.equal(seeds.size, 10, "all seeds must be unique");

  const svgs = new Set(avatars.map(a => a.svg));
  assert.equal(svgs.size, 10, "all SVGs must be unique");

  // Verify return object contains shape and palette
  assert.ok(avatars[0].shape);
  assert.ok(avatars[0].palette);
});

test("generateAvatars generates bulk unique avatars with 0 duplicates", () => {
  const count = 50;
  const list = generateAvatars(count);
  assert.equal(list.length, count);

  const uniqueSeeds = new Set(list.map(a => a.seed));
  assert.equal(uniqueSeeds.size, count, "Zero duplicate seeds allowed");

  const uniqueSvgs = new Set(list.map(a => a.svg));
  assert.equal(uniqueSvgs.size, count, "Zero duplicate SVGs allowed");
});

test("AvatarPool tracks session uniqueness", () => {
  const pool = createAvatarPool();
  const a1 = pool.next();
  const a2 = pool.next();
  assert.notEqual(a1.seed, a2.seed);
  assert.equal(pool.size, 2);

  const batch = pool.generate(5);
  assert.equal(batch.length, 5);
  assert.equal(pool.size, 7);

  pool.clear();
  assert.equal(pool.size, 0);
});

test("SVG clipPath IDs are unique across different seeds/shapes to prevent DOM collisions", () => {
  const a1 = createAvatar({ seed: "user-1", shape: "circle" });
  const a2 = createAvatar({ seed: "user-2", shape: "hexagon" });

  const idMatch1 = a1.svg.match(/clipPath id="([^"]+)"/);
  const idMatch2 = a2.svg.match(/clipPath id="([^"]+)"/);

  assert.ok(idMatch1 && idMatch1[1]);
  assert.ok(idMatch2 && idMatch2[1]);
  assert.notEqual(idMatch1[1], idMatch2[1], "ClipPath IDs must differ across avatars");
});

test("supports 3-digit and 8-digit hex colors", () => {
  const res = createAvatar({
    seed: "test",
    colors: ["#fff", "#12345678"]
  });
  assert.match(res.svg, /#FFFFFF/);
});

test("invalid inputs throw expected errors", () => {
  assert.throws(() => createAvatar({ size: 10 }), RangeError);
  assert.throws(() => createAvatar({ size: 2000 }), RangeError);
  assert.throws(() => createAvatar({ palette: "invalid_palette" }), TypeError);
  assert.throws(() => createAvatar({ shape: "triangle" }), TypeError);
  assert.throws(() => createAvatar({ density: 1 }), RangeError);
  assert.throws(() => generateAvatars(0), RangeError);
  assert.throws(() => generateAvatars(20000), RangeError);
  assert.throws(() => toDataUri("not-svg"), TypeError);
});

test("helpers return correct structures", () => {
  assert.ok(getPalettes().ocean.length >= 2);
  assert.ok(getShapes().includes("circle"));
  assert.match(avatarUrl({ seed: "test" }), /^data:image\/svg\+xml/);
  assert.match(toDataUri("<svg></svg>"), /^data:image\/svg\+xml/);
  assert.ok(typeof generateRandomSeed() === "string");
});

test("Axios-style default callable export and attached helpers", async () => {
  const avatar = (await import("../src/index.js")).default;

  // Direct call like axios('url')
  const a1 = avatar("manish");
  assert.equal(a1.seed, "manish");
  assert.ok(a1.svg.startsWith("<svg"));

  // Direct url helper
  const url = avatar.url("manish");
  assert.ok(url.startsWith("data:image/svg+xml"));

  // Direct svg helper
  const svg = avatar.svg("manish");
  assert.ok(svg.startsWith("<svg"));

  // Random avatar helper
  const rand = avatar.random();
  assert.ok(rand.seed);
  assert.ok(rand.svg);

  // Bulk generation helper
  const batch = avatar.generate(5);
  assert.equal(batch.length, 5);

  // Pool helper
  const pool = avatar.pool();
  assert.equal(typeof pool.next, "function");

  // Illustrated helpers (from user's 16 artwork avatars)
  const ill1 = avatar.illustration(1);
  assert.equal(ill1.id, 1);
  assert.ok(ill1.dataUri.startsWith("data:image/png;base64"));
  assert.ok(ill1.svg.startsWith("<svg"));

  const illUrl = avatar.illustration.url(1);
  assert.equal(illUrl, ill1.dataUri);

  const illSvg = avatar.illustration.svg(1);
  assert.equal(illSvg, ill1.svg);

  assert.equal(avatar.illustrations.length, 16);
  assert.equal(avatar.illustration.all().length, 16);

  // Palettes and shapes
  assert.ok(avatar.palettes().sunset);
  assert.ok(avatar.shapes().includes("circle"));
});

test("autoApply populates data-avatar elements automatically", async () => {
  const { autoApply, getIllustratedAvatar } = await import("../src/index.js");

  // Mock DOM elements
  const mockImg = {
    tagName: "IMG",
    src: "",
    getAttribute(name) {
      if (name === "data-avatar") return "john_doe";
      return null;
    },
    hasAttribute(name) {
      return false;
    }
  };

  const mockIllImg = {
    tagName: "IMG",
    src: "",
    getAttribute(name) {
      if (name === "data-avatar-illustrated") return "3";
      return null;
    }
  };

  const mockDiv = {
    tagName: "DIV",
    innerHTML: "",
    getAttribute(name) {
      if (name === "data-avatar") return "alice";
      return null;
    },
    hasAttribute() { return false; }
  };

  const mockRoot = {
    querySelectorAll(selector) {
      if (selector === "[data-avatar]") return [mockImg, mockDiv];
      if (selector === "[data-avatar-illustrated]") return [mockIllImg];
      return [];
    }
  };

  // Run autoApply on mock root
  autoApply(mockRoot);

  assert.ok(mockImg.src.startsWith("data:image/svg+xml"), "IMG data-avatar should have dataUri in src");
  assert.ok(mockDiv.innerHTML.startsWith("<svg"), "DIV data-avatar should have SVG in innerHTML");
  assert.equal(mockIllImg.src, getIllustratedAvatar(3).dataUri, "Illustrated IMG should have illustrated dataUri");
});

test("CommonJS require works seamlessly", async () => {
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const avatarCjs = require("../src/index.cjs");

  assert.equal(typeof avatarCjs, "function");
  const user = avatarCjs("charlie");
  assert.equal(user.seed, "charlie");
  assert.ok(avatarCjs.url("charlie").startsWith("data:image/svg+xml"));
  assert.equal(avatarCjs.illustration(1).id, 1);
  assert.equal(avatarCjs.illustrations.length, 16);
});
