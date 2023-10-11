import { Animation } from "./animations";

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
