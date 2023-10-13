"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fadeIn } from "./animations";
import { Renderer, createCharRender, createCharTypingRender } from "./renders";
import { context } from "./meta";
import { getTimeIncreaseValue, getTimeValue } from "./utils";

type TimelineItem = {
  type: "lyrics";
  time: number;
  x: number;
  y: number;
  fontSize?: number;
  text: string;
  animation?: "none" | "type";
};

const timeline: TimelineItem[] = [
  {
    type: "lyrics",
    time: 10.5,
    x: 1760,
    y: 120,
    text: "命に嫌われている。",
    fontSize: 80,
    animation: "none",
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
    x: 100,
    y: 880,
    text: "それを嘆いて誰かが歌って",
  },
  {
    type: "lyrics",
    time: 53,
    x: 200,
    y: 900,
    text: "それに感化された少年が",
  },
  {
    type: "lyrics",
    time: 55.5,
    x: 340,
    y: 980,
    text: "ナイフを持って走った。",
  },
  {
    type: "lyrics",
    time: 58,
    x: 500,
    y: 1080,
    text: "僕らは命に嫌われている。",
  },
  {
    type: "lyrics",
    time: 60,
    x: 700,
    y: 1120,
    text: "価値観もエゴも押し付けて",
  },
  {
    type: "lyrics",
    time: 62,
    x: 1200,
    y: 1200,
    text: "いつも誰かを殺したい歌を",
  },
  {
    type: "lyrics",
    time: 64,
    x: 1320,
    y: 1300,
    text: "簡単に電波で流した。",
  },
  {
    type: "lyrics",
    time: 67,
    x: 1580,
    y: 1400,
    text: "僕らは命に嫌われている。",
  },
  {
    type: "lyrics",
    time: 70,
    x: 240,
    y: 1500,
    text: "軽々しく死にたいだとか",
  },
  {
    type: "lyrics",
    time: 72,
    x: 380,
    y: 1560,
    text: "軽々しく命を見てる僕らは",
  },
  {
    type: "lyrics",
    time: 75,
    x: (1900 - 80) / 2,
    y: 1800,
    fontSize: 80,
    text: "命に嫌われている。",
  },
];

type Script = (
  ctx: CanvasRenderingContext2D,
  audio: HTMLAudioElement | null | undefined
) => Renderer[];

const chars =
  "点フツホ問両今クユセエ何集コト求車こぴ聞東成ひそのな祝質正案ぽけっ右土ぜち月返っせゅ拡首つ斐程やぼ治能こめご彦退".split(
    ""
  );

const createScript = (): Script => {
  const fontFamily = getComputedStyle(document.body).fontFamily;
  let objects: Renderer[] = [];
  let currentIndex = 0;

  return (ctx, audio) => {
    if (!audio) return objects;
    const timestamp = audio.currentTime;

    context.ctx = ctx;
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
          let renderer: Renderer;

          if (item.animation === "none") {
            renderer = createCharRender(
              item.text.charAt(i),
              item.x,
              i * (fontSize + 8) + item.y,
              {
                animation: fadeIn(item.time - context.time, 0),
                font: `${fontSize}px ${fontFamily}`,
              }
            );
          } else {
            const relativeDelay = i * 0.1 + item.time - context.time;

            renderer = createCharTypingRender(
              item.text.charAt(i),
              item.x,
              i * (fontSize + 8) + item.y,
              {
                animation: fadeIn(relativeDelay, 0.1),
                font: `${fontSize}px ${fontFamily}`,
                delay: relativeDelay,
                duration: 0.1,
                chars: chars.slice(
                  Math.round(Math.random() * (chars.length - 5))
                ),
              }
            );
          }

          objects.push(renderer);
        }
      }

      currentIndex++;
    }

    // global settings
    const alpha = 1 - getTimeValue(audio.duration - 5, audio.duration, 1);
    const yOffset = getTimeIncreaseValue(39, audio.duration, -40);

    ctx.globalAlpha = alpha;
    ctx.translate(0, yOffset);

    return objects;
  };
};

export function AnimateCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>();
  const [ready, setReady] = useState(false);

  const onClick = () => {
    if (!ready) return;
    const audio = audioRef.current!;

    audio.paused ? audio.play() : audio.pause();
  };

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d")!;
    let mounted = true;
    const script = createScript();

    if (!audioRef.current) {
      const audio = (audioRef.current = new Audio("/audio-short.mp3"));
      audio.load();
      audio.volume = 0.8;
      audio.addEventListener("loadeddata", () => {
        setReady(audio.readyState >= 3);
      });
    }

    const init = () => {
      canvas.width = 1920;
      canvas.height = 1080;
      ctx.strokeStyle = ctx.fillStyle = "white";
    };

    const loop = () => {
      if (!mounted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      init();

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
  }, [timeline]);

  return (
    <>
      <div
        className="fixed inset-0 bottom-2 flex items-center justify-center"
        onClick={onClick}
      >
        <canvas ref={ref} className="aspect-video max-w-full max-h-full" />
      </div>
      {ready && <Control audio={audioRef.current!} />}
    </>
  );
}

function Control({ audio }: { audio: HTMLAudioElement }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const [pause, setPause] = useState(true);
  const isDown = useRef(false);

  useEffect(() => {
    const onUpdateState = () => {
      setPause(audio.paused);
    };

    const onTimeUpdate = () => {
      setTime(audio.currentTime);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;
      setTimeFromX(e.clientX);
      e.stopPropagation();
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDown.current || e.targetTouches.length === 0) return;
      setTimeFromX(e.targetTouches.item(0)!.clientX);
      e.stopPropagation();
      e.preventDefault();
    };

    const onEnd = (e: Event) => {
      if (!isDown.current) return;
      isDown.current = false;
      audio.play();
      e.stopPropagation();
      e.preventDefault();
    };

    audio.addEventListener("play", onUpdateState);
    audio.addEventListener("pause", onUpdateState);
    audio.addEventListener("timeupdate", onTimeUpdate);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("mouseup", onEnd);

    return () => {
      audio.removeEventListener("play", onUpdateState);
      audio.removeEventListener("pause", onUpdateState);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("mouseup", onEnd);
    };
  }, [audio]);

  const setTimeFromX = useCallback(
    (x: number) => {
      if (!containerRef.current) return;
      const bounding = containerRef.current.getBoundingClientRect();
      const percent = (x - bounding.left) / bounding.width;

      audio.currentTime = Math.round(percent * audio.duration);
    },
    [audio]
  );

  return (
    <>
      {pause && (
        <div className="fixed inset-0 flex pointer-events-none select-none">
          <p className="font-medium m-auto text-center">Click to Play</p>
        </div>
      )}
      <div
        ref={containerRef}
        className="fixed w-full h-2 bottom-0 overflow-hidden cursor-pointer"
        onTouchStart={(e) => {
          if (e.targetTouches.length === 0) return;
          isDown.current = true;
          audio.pause();
          setTimeFromX(e.targetTouches.item(0)!.clientX);
        }}
        onMouseDown={(e) => {
          isDown.current = true;
          audio.pause();
          setTimeFromX(e.clientX);
        }}
      >
        <div
          className="bg-white h-full"
          style={{
            width: `${(time / audio.duration) * 100}%`,
          }}
        />
      </div>
    </>
  );
}
