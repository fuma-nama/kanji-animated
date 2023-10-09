import { Animation } from "./animations";
import { rotates } from "./meta";

export let context = {
  vertical: true,
};

export type Renderer = {
  render: () => void;
};

export function createCharRender(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  animation?: Animation
) {
  return {
    render: () => {
      ctx.save();
      ctx.textBaseline = "top";
      ctx.textAlign = "start";
      ctx.translate(x, y);
      if (context.vertical && rotates.has(char)) {
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        ctx.translate(
          ctx.measureText(char).width / 2,
          ctx.measureText(char).fontBoundingBoxDescent / 2
        );
        ctx.rotate(rotates.get(char)!);
      }

      animation?.beforeRender(ctx, char);

      ctx.fillText(char, 0, 0);

      animation?.afterRender(ctx, char);
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
  animation?: Animation
) {
  const base = createCharRender(ctx, char, x, y, animation);

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
