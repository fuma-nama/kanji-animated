"use client";
import { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { useLyrics } from "./lyrics";

type CharInfo = {
  d: string;
  width: number;
  height: number;
};

type Props = {
  text: string;
  delay: number;
};
export function Test(props: Props): ReactNode {
  const id = useId();
  const chars = useMemo(() => props.text.split(""), [props.text]);
  const { tts } = useLyrics();
  const fontSize = 70;
  const [svg, setSvg] = useState<CharInfo[]>([]);

  useEffect(() => {
    const h = tts.getHeight(fontSize);
    setSvg([]);

    for (const char of chars) {
      const w = tts.getWidth(char, { fontSize });

      setSvg((s) => [
        ...s,
        {
          d: tts.getD(char, {
            fontSize,
            anchor: "left top",
          }),
          width: w,
          height: h,
        },
      ]);
    }
  }, [chars, tts]);

  let x = 0;

  return (
    <div className="relative w-full" style={{ height: svg[0]?.height }}>
      {svg.map((char, i) => {
        const x1 = x;
        x += char.width;

        return (
          <svg
            key={i}
            width={char.width}
            height={char.height}
            style={{
              position: "absolute",
              left: `${x1}px`,
              top: 0,
            }}
          >
            <clipPath id={`${id}-${i}-clip`}>
              <path d={char.d} />
            </clipPath>
            <path
              className="animated-char"
              d={char.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={12}
              clipPath={`url(#${id}-${i}-clip)`}
              style={{
                animationDelay: `${i * 200 + props.delay}ms`,
              }}
            />
          </svg>
        );
      })}
    </div>
  );
}
