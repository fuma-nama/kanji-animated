"use client";
import { useEffect, useRef } from "react";
import { writing, fadeIn, stretchIn, slideIn } from "./animations";
import {
  Renderer,
  context,
  createCharRender,
  createCharTypingRender,
} from "./renders";

const texts = [
  "「死にたいなんて言うなよ。」",
  "「諦めないで生きろよ。」",
  "そんな歌が正しいなんて馬鹿げてるよな。",
  "実際自分は死んでもよくて",
  "周りが死んだら悲しくて",
];

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

    for (let i = 0; i < texts[0].length; i++) {
      objects.push(
        createCharRender(
          ctx,
          texts[0].charAt(i),
          40,
          i * 60 + 120,
          writing(i * 10)
        )
      );
    }

    for (let i = 0; i < texts[1].length; i++) {
      objects.push(
        createCharRender(
          ctx,
          texts[1].charAt(i),
          120,
          i * 60 + 120,
          fadeIn(i * 10)
        )
      );
    }

    for (let i = 0; i < texts[2].length; i++) {
      objects.push(
        createCharTypingRender(
          ctx,
          texts[2].charAt(i),
          200,
          i * 60 + 120,
          i * 10
        )
      );
    }

    for (let i = 0; i < texts[3].length; i++) {
      objects.push(
        createCharRender(
          ctx,
          texts[3].charAt(i),
          280,
          i * 60 + 120,
          stretchIn(i * 10)
        )
      );
    }

    for (let i = 0; i < texts[4].length; i++) {
      objects.push(
        createCharRender(
          ctx,
          texts[4].charAt(i),
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
