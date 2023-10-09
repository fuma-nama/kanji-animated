"use client";
import { useEffect, useRef } from "react";

const rotates = new Map(
  Object.entries({
    "「": Math.PI / 2,
    "」": Math.PI / 2,
    "。": -Math.PI,
  })
);

let context = {
  vertical: true,
};

export function AnimateCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    const canvas = ref.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d")!;
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const objects: Renderer[] = [];
    let mounted = true;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      ctx.font = `50px ${fontFamily}`;
      ctx.strokeStyle = ctx.fillStyle = "white";
      ctx.scale(dpr, dpr);
    };

    const loop = () => {
      if (!mounted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      init();

      context.vertical = true;
      for (const object of objects) {
        object.render();
      }

      requestAnimationFrame(loop);
    };

    const text = "「死にたいなんて言うなよ。」";
    for (let i = 0; i < text.length; i++) {
      objects.push(
        createCharRender(ctx, text.charAt(i), 40, i * 60 + 120, writing(i * 10))
      );
    }

    for (let i = 0; i < text.length; i++) {
      objects.push(
        createCharRender(ctx, text.charAt(i), 120, i * 60 + 120, fadeIn(i * 10))
      );
    }

    for (let i = 0; i < text.length; i++) {
      objects.push(
        createCharTypingRender(ctx, text.charAt(i), 200, i * 60 + 120, i * 10)
      );
    }

    for (let i = 0; i < text.length; i++) {
      objects.push(
        createCharRender(
          ctx,
          text.charAt(i),
          280,
          i * 60 + 120,
          stretchIn(i * 10)
        )
      );
    }

    for (let i = 0; i < text.length; i++) {
      objects.push(
        createCharRender(
          ctx,
          text.charAt(i),
          360,
          i * 60 + 120,
          slideIn(i * 10)
        )
      );
    }

    loop();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
}

type Renderer = {
  render: () => void;
};

function createCharRender(
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

function createCharTypingRender(
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

type Animation = {
  beforeRender: (ctx: CanvasRenderingContext2D, char: string) => void;
  afterRender: (ctx: CanvasRenderingContext2D, char: string) => void;
};

function writing(delay: number, speed = 5): Animation {
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

function fadeIn(delay: number, speed = 5): Animation {
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

function stretchIn(delay: number, speed = 5): Animation {
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

function slideIn(delay: number, speed = 5): Animation {
  let x = 100;
  const base = fadeIn(delay, speed);

  return {
    beforeRender(ctx, char) {
      if (delay < 0) x = Math.max(0, x - speed);
      else delay--;

      ctx.translate(x, 0);
      base.beforeRender(ctx, char);
    },
    afterRender() {},
  };
}
