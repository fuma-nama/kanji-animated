import { Animation } from "./animations";
import { context, requireContext, rotates } from "./meta";
import {
  getTimeValue,
  renderAnimationsAfter,
  renderAnimationsBefore,
} from "./utils";

export type Renderer = {
  render: () => void;
};

type CharRendererOptions = Partial<{
  font: string;
  animation: Animation | Animation[];
}>;

export function createCharRender(
  char: string,
  x: number,
  y: number,
  options: CharRendererOptions = {}
) {
  return {
    render: () => {
      render(char, x, y, options);
    },
  };
}

export function createCharTypingRender(
  char: string,
  x: number,
  y: number,
  {
    delay,
    duration,
    chars,
    ...options
  }: CharRendererOptions & {
    delay: number;
    duration: number;
    /**
     * Characters to be displayed when typing
     */
    chars: string[];
  }
) {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;

  return {
    render: () => {
      if (context.time < startTime) return;
      const v = Math.round(getTimeValue(startTime, endTime, chars.length));

      if (v >= 0 && v < chars.length) {
        render(chars[v], x, y, options);
      } else {
        render(char, x, y, options);
      }
    },
  };
}

function render(
  char: string,
  x: number,
  y: number,
  { animation, font }: CharRendererOptions
) {
  const ctx = requireContext();
  ctx.save();
  if (font) ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.translate(
    x + ctx.measureText(char).width / 2,
    y + ctx.measureText(char).fontBoundingBoxDescent / 2
  );
  if (context.vertical && rotates.has(char)) {
    ctx.rotate(rotates.get(char)!);
  }

  if (animation) renderAnimationsBefore(char, animation);

  ctx.fillText(char, 0, 0);

  if (animation) renderAnimationsAfter(char, animation);
  ctx.restore();
}
