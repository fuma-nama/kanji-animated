import { useLyrics } from "@/app/lyrics";
import { forwardRef, useId, useMemo } from "react";
import { useStyle } from "./context";

export type CharProps = {
  x: number;
  y: number;
  /**
   * ms
   */
  duration: number;
  /**
   * ms
   */
  delay: number;

  char: string;
};

/**
 * Some necessary features for vetical writing mode are missing for now
 * (including vmtx table)
 *
 * We'll rotate the character with `transform`
 */
const rotate_chars: Record<string, number> = {
  "「": 90,
  "」": 90,
  "。": 180,
};

export const WriteChar = forwardRef<SVGSVGElement, CharProps>(
  ({ char, delay, duration, x, y }, ref) => {
    const id = useId();
    const { tts } = useLyrics();
    const { fontSize, vertical } = useStyle();

    const info = useMemo(() => {
      const w = tts.getWidth(char, { fontSize });
      const h = tts.getHeight(fontSize);

      return {
        d: tts.getD(char, {
          fontSize,
          anchor: "left top",
        }),
        width: w,
        height: h,
      };
    }, [char]);

    return (
      <svg
        ref={ref}
        width={info.width}
        height={info.height}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform:
            vertical && char in rotate_chars
              ? `rotate(${rotate_chars[char]}deg)`
              : undefined,
        }}
      >
        <clipPath id={`${id}-clip`}>
          <path d={info.d} />
        </clipPath>
        <path
          d={info.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          clipPath={`url(#${id}-clip)`}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
            animation: `writing-char ${duration}ms linear ${delay}ms forwards`,
          }}
        />
      </svg>
    );
  }
);
