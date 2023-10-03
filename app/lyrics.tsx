"use client";

import { Test } from "./test";

export function Lyrics() {
  return (
    <>
      <Test delay={0} text="「死にたいなんて言うなよ。」" />
      <Test delay={7 * 300} text="「諦めないで生きろよ。」" />
      <Test delay={14 * 300} text="そんな歌が正しいなんて" />
      <Test delay={20 * 300} text="馬鹿げてるよな。" />
    </>
  );
}
