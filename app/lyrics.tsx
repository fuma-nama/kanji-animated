"use client";

import { Test } from "./test";

export function Lyrics() {
  return (
    <>
      <Test delay={0} text="漢字アニメーション" />
      <Test delay={7 * 300} text="死にたいなんて言うなよ" />
      <Test delay={14 * 300} text="諦めないで生きろよ" />
    </>
  );
}
