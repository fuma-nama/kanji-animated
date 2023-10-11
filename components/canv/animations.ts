import { context } from "./meta";
import { renderAnimationsAfter, renderAnimationsBefore } from "./utils";

export type Animation = {
  beforeRender: (ctx: CanvasRenderingContext2D, char: string) => void;
  afterRender: (ctx: CanvasRenderingContext2D, char: string) => void;
};

export function writing(delay: number, duration = 1): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;
  const dashLen = 220;

  return {
    beforeRender(ctx) {
      ctx.fillStyle = "black";
    },
    afterRender(ctx, char) {
      const offset = getTimeValue(startTime, endTime, dashLen);
      ctx.setLineDash([offset, dashLen - offset]);
      ctx.lineWidth = 10;
      ctx.globalCompositeOperation = "source-atop";
      ctx.strokeText(char, 0, 0);
    },
  };
}

export function fadeIn(delay: number, duration = 1): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;

  return {
    beforeRender(ctx) {
      const opacity = getTimeValue(startTime, endTime, 100);

      ctx.fillStyle = `rgba(255,255,255,${opacity / 100})`;
    },
    afterRender() {},
  };
}

export function scaleIn(
  delay: number,
  duration = 1,
  {
    type = "x",
    sub = [fadeIn(delay, duration)],
    from = 8,
  }: Partial<{
    from: number;
    sub: Animation[];
    type: "x" | "y" | "all";
  }> = {}
): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;

  return {
    beforeRender(ctx, char) {
      const scale = from - getTimeValue(startTime, endTime, from - 1);

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
  duration = 1,
  {
    type = "x",
    offset = 8,
    sub = [fadeIn(delay, duration)],
  }: Partial<{
    sub: Animation[];
    offset: number;
    type: "x" | "y";
  }> = {}
): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;

  return {
    beforeRender(ctx, char) {
      const v = offset - getTimeValue(startTime, endTime, offset);

      if (type === "x") ctx.translate(v, 0);
      else ctx.translate(0, v);
      renderAnimationsBefore(ctx, char, sub);
    },
    afterRender(ctx, char) {
      renderAnimationsAfter(ctx, char, sub);
    },
  };
}

function getTimeValue(start: number, end: number, value: number): number {
  if (context.time < start) return 0;
  const per = Math.min((context.time - start) / (end - start), 1);
  return value * per;
}
