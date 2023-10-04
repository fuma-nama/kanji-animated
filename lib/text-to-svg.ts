/**
 * Copyright (c) 2016 Hideki Shiro
 */

/**
 * Modified by Fuma for additional features
 */

import * as opentype from "opentype.js";

function parseAnchorOption(anchor: string) {
  const horizontalMatch = anchor.match(/left|center|right/gi) || [];
  const horizontal = horizontalMatch[0] ?? "left";

  const verticalMatch = anchor.match(/baseline|top|bottom|middle/gi) || [];
  const vertical = verticalMatch[0] ?? "baseline";

  return { horizontal, vertical };
}

type Options = {
  fontSize?: number;
  kerning?: boolean;
  letterSpacing?: number;
  tracking?: number;
};

type Horizontal = "left" | "center" | "right";
type Vertical = "baseline" | "top" | "bottom" | "middle";

type DrawOptions = Options & {
  x?: number;
  y?: number;
  anchor?: `${Horizontal} ${Vertical}`;
  features?: { [key: string]: boolean };
};

export default class TextToSVG {
  font: opentype.Font;

  constructor(font: opentype.Font) {
    this.font = font;
  }

  static async load(url: string): Promise<TextToSVG> {
    const buffer = await fetch(url).then((res) => res.arrayBuffer());

    return new TextToSVG(opentype.parse(buffer));
  }

  getWidth(text: string, options: Options) {
    const fontSize = options.fontSize || 72;
    const kerning = "kerning" in options ? options.kerning : true;
    const fontScale = (1 / this.font.unitsPerEm) * fontSize;

    let width = 0;
    const glyphs = this.font.stringToGlyphs(text);
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];

      if (glyph.advanceWidth) {
        width += glyph.advanceWidth * fontScale;
      }

      if (kerning && i < glyphs.length - 1) {
        const kerningValue = this.font.getKerningValue(glyph, glyphs[i + 1]);
        width += kerningValue * fontScale;
      }

      if (options.letterSpacing) {
        width += options.letterSpacing * fontSize;
      } else if (options.tracking) {
        width += (options.tracking / 1000) * fontSize;
      }
    }
    return width;
  }

  getHeight(fontSize: number) {
    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    return (this.font.ascender - this.font.descender) * fontScale;
  }

  getMetrics(text: string, options: DrawOptions) {
    const fontSize = options.fontSize || 72;
    const anchor = parseAnchorOption(options.anchor || "");

    const width = this.getWidth(text, options);
    const height = this.getHeight(fontSize);

    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    const ascender = this.font.ascender * fontScale;
    const descender = this.font.descender * fontScale;

    let x = options.x || 0;
    switch (anchor.horizontal) {
      case "left":
        x -= 0;
        break;
      case "center":
        x -= width / 2;
        break;
      case "right":
        x -= width;
        break;
      default:
        throw new Error(`Unknown anchor option: ${anchor.horizontal}`);
    }

    let y = options.y || 0;
    switch (anchor.vertical) {
      case "baseline":
        y -= ascender;
        break;
      case "top":
        y -= 0;
        break;
      case "middle":
        y -= height / 2;
        break;
      case "bottom":
        y -= height;
        break;
      default:
        throw new Error(`Unknown anchor option: ${anchor.vertical}`);
    }

    const baseline = y + ascender;

    return {
      x,
      y,
      baseline,
      width,
      height,
      ascender,
      descender,
    };
  }

  getD(text: string, options: DrawOptions) {
    const fontSize = options.fontSize ?? 72;
    const kerning = options.kerning ?? true;
    const letterSpacing = options.letterSpacing ?? 0;
    const tracking = options.tracking ?? 0;
    const metrics = this.getMetrics(text, options);

    const path = this.font.getPath(
      text,
      metrics.x,
      metrics.baseline,
      fontSize,
      {
        kerning,
        letterSpacing,
        tracking,
        features: options.features ?? {},
      }
    );

    return path.toPathData(2);
  }
}
