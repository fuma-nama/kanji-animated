import { context, requireContext } from "./meta";
import {
  getTimeValue,
  renderAnimationsAfter,
  renderAnimationsBefore,
} from "./utils";

export type Animation = {
  beforeRender: (char: string) => void;
  afterRender: (char: string) => void;
};

export function writing(delay: number, duration = 1): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;
  const dashLen = 220;

  return {
    beforeRender() {
      requireContext().fillStyle = "black";
    },
    afterRender(char) {
      const ctx = requireContext();
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
    beforeRender() {
      const ctx = requireContext();
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
    type = "all",
    sub = [fadeIn(delay, duration)],
    from = 2,
  }: Partial<{
    from: number;
    sub: Animation[];
    type: "x" | "y" | "all";
  }> = {}
): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;

  return {
    beforeRender(char) {
      const ctx = requireContext();
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
      renderAnimationsBefore(char, sub);
    },
    afterRender(char) {
      renderAnimationsAfter(char, sub);
    },
  };
}

export function slideIn(
  delay: number,
  duration = 1,
  {
    type = "x",
    offset = 60,
    sub = [fadeIn(delay, duration * 1.5)],
  }: Partial<{
    sub: Animation[];
    offset: number;
    type: "x" | "y";
  }> = {}
): Animation {
  const startTime = context.time + delay,
    endTime = context.time + delay + duration;

  return {
    beforeRender(char) {
      const ctx = requireContext();
      const v = offset - getTimeValue(startTime, endTime, offset);

      if (type === "x") ctx.translate(v, 0);
      else ctx.translate(0, v);
      renderAnimationsBefore(char, sub);
    },
    afterRender(char) {
      renderAnimationsAfter(char, sub);
    },
  };
}
