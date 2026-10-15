import * as React from "react";
import type { AvatarOptions } from "./index.js";

export interface AvatarProps extends AvatarOptions {
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "img" | "svg";
  randomize?: boolean;
}

export declare function Avatar(props: AvatarProps & (React.ImgHTMLAttributes<HTMLImageElement> | React.HTMLAttributes<HTMLSpanElement>)): React.ReactElement;
export default Avatar;
