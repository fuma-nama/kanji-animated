export const rotates = new Map(
  Object.entries({
    "「": Math.PI / 2,
    "」": Math.PI / 2,
    "。": -Math.PI,
  })
);

export let context = {
  time: 0,
  vertical: true,
};
