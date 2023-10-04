import { FC, useMemo } from "react";
import { CharProps } from "./char";
import { StyleProvider } from "./context";

export function Sequence({
  duration,
  chars,
  comp: Comp,
  delay = 0,
  position,
  preDraw = 0,
}: {
  chars: string;
  delay?: number;
  duration: number;
  preDraw?: number;
  position: (x: number, y: number) => [x: number, y: number];
  comp: FC<CharProps>;
}) {
  const items = useMemo(() => {
    return chars.split("");
  }, [chars]);

  const charDuration = duration / items.length;
  let xOffset = 0,
    yOffset = 0;

  return (
    <>
      {items.map((item, i) => {
        const [x, y] = position(xOffset, yOffset);
        xOffset = x;
        yOffset = y;

        return (
          <Comp
            x={x}
            y={y}
            key={i}
            char={item}
            delay={delay + i * charDuration - i * preDraw}
            duration={charDuration + i * preDraw}
          />
        );
      })}
    </>
  );
}
