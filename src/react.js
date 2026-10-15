import React, { useMemo } from "react";
import { createAvatar, generateRandomSeed } from "./index.js";

export function Avatar({
  seed,
  size = 128,
  palette,
  colors,
  shape,
  density,
  background = "transparent",
  stroke = "none",
  alt = "",
  className,
  style,
  as = "img",
  randomize = false,
  mode,
  illustrated,
  illustration,
  ...restProps
}) {
  const isIllustrated = mode === "illustration" || Boolean(illustrated) || illustration !== undefined;
  // If no seed is passed, generate a unique random seed memoized for this component instance
  const effectiveSeed = useMemo(() => {
    if (illustration !== undefined) return illustration;
    return (seed !== undefined && seed !== null && String(seed).trim().length > 0)
      ? String(seed)
      : generateRandomSeed();
  }, [seed, illustration]);

  const avatar = useMemo(() => {
    const isAutoRandom = randomize || (!isIllustrated && seed === undefined && palette === undefined && shape === undefined);
    return createAvatar({
      seed: effectiveSeed,
      size,
      palette,
      colors,
      shape,
      density,
      background,
      stroke,
      label: alt,
      randomize: isAutoRandom,
      mode: isIllustrated ? "illustration" : undefined,
      illustrated: isIllustrated
    });
  }, [effectiveSeed, size, palette, colors, shape, density, background, stroke, alt, randomize, isIllustrated]);

  if (as === "svg") {
    return React.createElement("span", {
      className,
      style: {
        display: "inline-block",
        width: size,
        height: size,
        lineHeight: 0,
        ...style
      },
      dangerouslySetInnerHTML: { __html: avatar.svg },
      ...restProps
    });
  }

  return React.createElement("img", {
    src: avatar.dataUri,
    width: size,
    height: size,
    alt,
    className,
    style,
    ...restProps
  });
}

export default Avatar;
