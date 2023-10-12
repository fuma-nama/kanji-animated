import { Animation } from "./animations";
import { context } from "./meta";

export function renderAnimationsBefore(
  ctx: CanvasRenderingContext2D,
  char: string,
  animations: Animation | Animation[]
) {
  if (Array.isArray(animations))
    animations.forEach((v) => v.beforeRender(ctx, char));
  else animations.beforeRender(ctx, char);
}

export function renderAnimationsAfter(
  ctx: CanvasRenderingContext2D,
  char: string,
  animations: Animation | Animation[]
) {
  if (Array.isArray(animations))
    animations.forEach((v) => v.afterRender(ctx, char));
  else animations.afterRender(ctx, char);
}

/**
 * Transition from 0 to a specific value
 * @param start When transition starts
 * @param end When transition ends
 * @param value The value to transition
 */
export function getTimeValue(
  start: number,
  end: number,
  value: number
): number {
  if (context.time < start) return 0;
  const percent = Math.min((context.time - start) / (end - start), 1);
  return value * percent;
}

/**
 * @param start When transition starts
 * @param end When transition ends
 * @param increase How much value to increase per unit
 */
export function getTimeIncreaseValue(
  start: number,
  end: number,
  increase: number
): number {
  return getTimeValue(start, end, Math.max(end - start, 0) * increase);
}
