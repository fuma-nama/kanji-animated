export const rotates = new Map(
  Object.entries({
    "「": Math.PI / 2,
    "」": Math.PI / 2,
    "。": -Math.PI,
  })
);

type Context = {
  ctx: CanvasRenderingContext2D | null;
  time: number;
  vertical: boolean;
};

export let context: Context = {
  ctx: null,
  time: 0,
  vertical: true,
};

export function requireContext() {
  return context.ctx!;
}
