export type AvatarShape = "circle" | "rounded" | "square" | "hexagon";
export type AvatarPalette = "ocean" | "sunset" | "forest" | "berry" | "mono" | "candy";
export type AvatarHair = "mohawk" | "waves" | "parted" | "bob" | "crop" | "bun" | "beanie" | "pompadour";

export interface AvatarOptions {
  seed?: string | number;
  size?: number;
  shape?: AvatarShape;
  palette?: AvatarPalette;
  colors?: string[];
  hair?: number | AvatarHair;
  mode?: "vector" | "illustration";
  illustrated?: boolean;
  illustration?: number | string;
  background?: string;
  stroke?: string;
  label?: string;
  randomize?: boolean;
}

export interface IllustratedAvatarItem {
  id: number;
  dataUri: string;
  svg: string;
}

export interface AvatarResult {
  seed: string;
  size: number;
  svg: string;
  dataUri: string;
  palette: string;
  shape: AvatarShape;
  colors: string[];
}

export declare const PALETTES: Record<AvatarPalette, string[]>;
export declare const SHAPES: readonly AvatarShape[];
export declare const SKIN_TONES: readonly string[];
export declare const HAIR_COLORS: readonly string[];
export declare const CLOTHING_COLORS: readonly string[];
export declare const BG_COLORS: readonly string[];
export declare const ILLUSTRATED_AVATARS: readonly IllustratedAvatarItem[];

export declare function generateRandomSeed(): string;
export declare function hashString(input: string): number;
export declare function randomAvatar(options?: AvatarOptions | string | number): AvatarResult;
export declare function generateAvatars(count?: number, options?: AvatarOptions): AvatarResult[];
export declare function avatarUrl(options?: AvatarOptions | string | number): string;
export declare function avatarSvg(options?: AvatarOptions | string | number): string;
export declare function getPalettes(): Record<AvatarPalette, string[]>;
export declare function getShapes(): AvatarShape[];
export declare function getHairstyles(): string[];
export declare function getIllustratedAvatars(): readonly IllustratedAvatarItem[];
export declare function getIllustratedAvatar(idOrSeed?: string | number): IllustratedAvatarItem;
export declare function toDataUri(svg: string): string;
export declare function autoApply(root?: any): void;

export declare class AvatarPool {
  constructor(options?: AvatarOptions);
  next(overrideOptions?: AvatarOptions): AvatarResult;
  generate(count: number, overrideOptions?: AvatarOptions): AvatarResult[];
  clear(): void;
  get size(): number;
}
export declare function createAvatarPool(options?: AvatarOptions): AvatarPool;

export interface IllustratedHelper {
  (idOrSeed?: string | number): IllustratedAvatarItem;
  url(idOrSeed?: string | number): string;
  svg(idOrSeed?: string | number): string;
  all(): readonly IllustratedAvatarItem[];
}

export interface AvatarCallable {
  (options?: AvatarOptions | string | number): AvatarResult;
  create(options?: AvatarOptions | string | number): AvatarResult;
  random(options?: AvatarOptions | string | number): AvatarResult;
  generate(count?: number, options?: AvatarOptions): AvatarResult[];
  pool(options?: AvatarOptions): AvatarPool;
  url(options?: AvatarOptions | string | number): string;
  svg(options?: AvatarOptions | string | number): string;
  illustration: IllustratedHelper;
  illustrations: readonly IllustratedAvatarItem[];
  getIllustratedAvatar(idOrSeed?: string | number): IllustratedAvatarItem;
  getIllustratedAvatars(): readonly IllustratedAvatarItem[];
  palettes(): Record<AvatarPalette, string[]>;
  shapes(): AvatarShape[];
  hairstyles(): string[];
  toDataUri(svg: string): string;
  auto(root?: any): void;
}

export declare const createAvatar: AvatarCallable;
export default createAvatar;
