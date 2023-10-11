import { Animation } from "./animations";
import { context, rotates } from "./meta";
import { renderAnimationsAfter, renderAnimationsBefore } from "./utils";

export type Renderer = {
  render: () => void;
};

type CharRendererOptions = Partial<{
  font: string;
  animation: Animation | Animation[];
}>;

export function createCharRender(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  { animation, font }: CharRendererOptions = {}
) {
  return {
    render: () => {
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

      if (animation) renderAnimationsBefore(ctx, char, animation);

      ctx.fillText(char, 0, 0);

      if (animation) renderAnimationsAfter(ctx, char, animation);
      ctx.restore();
    },
  };
}

export function createCharTypingRender(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  delay: number,
  options: CharRendererOptions
) {
  const base = createCharRender(ctx, char, x, y, options);

  return {
    render: () => {
      if (delay > 0) {
        const metrics = ctx.measureText(char);
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        if (delay < 10)
          ctx.fillRect(x, y, metrics.width, metrics.fontBoundingBoxDescent);
        delay--;
      } else {
        base.render();
      }
    },
  };
}
