"use client";
import { useEffect, useRef, useState } from "react";
import { writing } from "./animations";
import { Renderer, createCharRender } from "./renders";
import { context } from "./meta";

type TimelineItem =
  | {
      type: "lyrics";
      time: number;
      x: number;
      y: number;
      fontSize?: number;
      text: string;
    }
  | {
      type: "move";
      v: number;
      time: number;
    };

const timeline: TimelineItem[] = [
  {
    type: "move",
    time: 0,
    v: 0,
  },
  {
    type: "lyrics",
    time: 20,
    x: 80,
    y: 120,
    text: "「死にたいなんて言うなよ。」",
  },
  {
    type: "lyrics",
    time: 22.5,
    x: 200,
    y: 200,
    text: "「諦めないで生きろよ。」",
  },
  {
    type: "lyrics",
    time: 24.2,
    x: 400,
    y: 160,
    text: "そんな歌が正しいなんて馬鹿げてるよな。",
  },
  {
    type: "lyrics",
    time: 28.5,
    x: 280,
    y: 240,
    text: "実際自分は死んでもよくて",
  },
  {
    type: "lyrics",
    time: 31.5,
    x: 600,
    y: 360,
    text: "周りが死んだら悲しくて",
  },
  {
    y: 200,
    type: "lyrics",
    time: 33.5,
    x: 720,
    text: "「それが嫌だから」っていう",
  },
  {
    y: 300,
    type: "lyrics",
    time: 36,
    x: 800,
    text: "エゴなんです。",
  },
  {
    y: 200,
    type: "lyrics",
    time: 38.5,
    x: 1000,
    text: "他人が生きてもどうでもよくて",
  },
  {
    type: "move",
    time: 39,
    v: -30,
  },
  {
    type: "lyrics",
    time: 41,
    x: 1200,
    y: 400,
    text: "誰かを嫌うこともファッションで",
  },
  {
    type: "lyrics",
    time: 43.5,
    x: 1280,
    y: 420,
    text: "それでも「平和に生きよう」",
  },
  {
    type: "lyrics",
    time: 45.8,
    x: 1400,
    y: 540,
    text: "なんて素敵なことでしょう。",
  },
  {
    type: "lyrics",
    time: 48.5,
    x: 1500,
    y: 640,
    text: "画面の先では誰かが死んで",
  },
  {
    type: "lyrics",
    time: 50.5,
    x: 1580,
    y: 700,
    text: "それを嘆いて誰かが歌って",
  },
  { type: "lyrics", time: 53, x: 1120, y: 760, text: "それに感化された少年が" },
  {
    type: "lyrics",
    time: 55.5,
    x: 980,
    y: 860,
    text: "ナイフを持って走った。",
  },
  {
    type: "lyrics",
    time: 58,
    x: 800,
    y: 900,
    text: "僕らは命に嫌われている。",
  },
  {
    type: "lyrics",
    time: 60,
    x: 480,
    y: 940,
    text: "価値観もエゴも押し付けて",
  },
  {
    type: "lyrics",
    time: 62,
    x: 120,
    y: 1100,
    text: "いつも誰かを殺したい歌を",
  },
  {
    type: "lyrics",
    time: 64,
    x: 420,
    y: 1200,
    text: "簡単に電波で流した。",
  },
  {
    type: "lyrics",
    time: 67,
    x: 600,
    y: 1200,
    text: "僕らは命に嫌われている。",
  },
  {
    type: "lyrics",
    time: 70,
    x: 740,
    y: 1400,
    text: "軽々しく死にたいだとか",
  },
  {
    type: "lyrics",
    time: 72,
    x: 1120,
    y: 1420,
    text: "軽々しく命を見てる僕らは",
  },
  {
    type: "lyrics",
    time: 75,
    x: (1900 - 80) / 2,
    y: 1500,
    fontSize: 80,
    text: "命に嫌われている。",
  },
];

type Script = (
  ctx: CanvasRenderingContext2D,
  audio: HTMLAudioElement | null | undefined
) => Renderer[];

const createScript = (): Script => {
  const fontFamily = getComputedStyle(document.body).fontFamily;
  let objects: Renderer[] = [];
  let currentIndex = 0;
  let movementOrigin = 0;
  let movementValue = 0;

  const reset = () => {};

  return (ctx, audio) => {
    if (!audio) return objects;
    if (audio.ended) reset();
    const timestamp = audio.currentTime;

    context.vertical = true;
    context.time = timestamp;

    while (
      currentIndex < timeline.length &&
      timestamp > timeline[currentIndex].time
    ) {
      const item = timeline[currentIndex];
      if (item.type === "lyrics") {
        for (let i = 0; i < item.text.length; i++) {
          const fontSize = item.fontSize ?? 38;

          objects.push(
            createCharRender(
              ctx,
              item.text.charAt(i),
              item.x,
              i * (fontSize + 8) + item.y,
              {
                animation: writing(i * 0.1 + item.time - context.time),
                font: `${fontSize}px ${fontFamily}`,
              }
            )
          );
        }
      }

      if (item.type === "move") {
        movementOrigin = item.time;
        movementValue = item.v;
      }

      currentIndex++;
    }

    if (timestamp > movementOrigin)
      ctx.translate(
        0,
        ((timestamp - movementOrigin) / audio.duration) * 100 * movementValue
      );

    return objects;
  };
};

export function AnimateCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>();
  const [second, setSecond] = useState<number>();

  const onClick = () => {
    const audio = audioRef.current;
    if (!audio || audio.readyState < 3) return;

    audio.paused ? audio.play() : audio.pause();
  };

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d")!;
    let mounted = true;
    const script = createScript();

    if (!audioRef.current) {
      audioRef.current = new Audio("/audio-short.mp3");
      audioRef.current.load();
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = 1920 * dpr;
      canvas.height = 1080 * dpr;
      ctx.strokeStyle = ctx.fillStyle = "white";
      ctx.scale(dpr, dpr);
    };

    const loop = () => {
      if (!mounted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      init();

      const audio = audioRef.current;

      setSecond(
        audio == null || audio.paused
          ? undefined
          : Math.round(audio.currentTime)
      );

      const objects = script(ctx, audioRef.current);
      for (const object of objects) {
        object.render();
      }

      requestAnimationFrame(loop);
    };

    loop();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <p className="absolute left-12 bottom-4 text-sm select-none touch-none pointer-events-none">
        {second != null ? `${second}s` : "Click to Play"}
      </p>
      <canvas ref={ref} className="aspect-video max-w-full max-h-full" />
    </div>
  );
}
