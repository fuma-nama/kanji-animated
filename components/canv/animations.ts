import { renderAnimationsAfter, renderAnimationsBefore } from "./utils";

export type Animation = {
  beforeRender: (ctx: CanvasRenderingContext2D, char: string) => void;
  afterRender: (ctx: CanvasRenderingContext2D, char: string) => void;
};

export function writing(delay: number, speed = 5): Animation {
  let dashLen = 220,
    dashOffset = dashLen;

  return {
    beforeRender(ctx) {
      if (delay < 0) {
        dashOffset -= speed;
      } else delay--;

      ctx.fillStyle = "black";
    },
    afterRender(ctx, char) {
      ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]);
      ctx.lineWidth = 10;
      ctx.globalCompositeOperation = "source-atop";
      ctx.strokeText(char, 0, 0);
    },
  };
}

export function fadeIn(delay: number, speed = 5): Animation {
  let opacity = 0;

  return {
    beforeRender(ctx) {
      if (delay < 0) opacity += speed;
      else delay--;

      ctx.fillStyle = `rgba(255,255,255,${opacity / 100})`;
    },
    afterRender() {},
  };
}

export function scaleIn(
  delay: number,
  speed = 5,
  {
    type = "x",
    sub = [fadeIn(delay, speed)],
    from = 8,
  }: Partial<{
    from: number;
    sub: Animation[];
    type: "x" | "y" | "all";
  }> = {}
): Animation {
  let scale = from;

  return {
    beforeRender(ctx, char) {
      if (delay < 0) scale = Math.max(1, scale - speed / 10);
      else delay--;

      switch (type) {
        case "x":
          ctx.scale(scale, 1);
          break;
        case "y":
          ctx.scale(1, scale);
          break;
        default:
          ctx.scale(scale, scale);
      }
      renderAnimationsBefore(ctx, char, sub);
    },
    afterRender(ctx, char) {
      renderAnimationsAfter(ctx, char, sub);
    },
  };
}

export function slideIn(
  delay: number,
  speed = 5,
  {
    type = "x",
    sub = [fadeIn(delay, speed)],
  }: Partial<{
    sub: Animation[];
    type: "x" | "y";
  }> = {}
): Animation {
  let v = 100;

  return {
    beforeRender(ctx, char) {
      if (delay < 0) v = Math.max(0, v - speed);
      else delay--;

      if (type === "x") ctx.translate(v, 0);
      else ctx.translate(0, v);
      renderAnimationsBefore(ctx, char, sub);
    },
    afterRender(ctx, char) {
      renderAnimationsAfter(ctx, char, sub);
    },
  };
}
