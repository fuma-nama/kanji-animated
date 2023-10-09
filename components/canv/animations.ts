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

export function stretchIn(delay: number, speed = 5): Animation {
  let scaleX = 8;
  const base = fadeIn(delay, speed);

  return {
    beforeRender(ctx, char) {
      if (delay < 0) scaleX = Math.max(1, scaleX - speed / 10);
      else delay--;

      ctx.scale(scaleX, 1);
      base.beforeRender(ctx, char);
    },
    afterRender() {},
  };
}

export function slideIn(
  delay: number,
  speed = 5,
  type: "x" | "y" = "x"
): Animation {
  let v = 100;
  const base = fadeIn(delay, speed);

  return {
    beforeRender(ctx, char) {
      if (delay < 0) v = Math.max(0, v - speed);
      else delay--;

      if (type === "x") ctx.translate(v, 0);
      else ctx.translate(0, v);
      base.beforeRender(ctx, char);
    },
    afterRender() {},
  };
}
