"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Test } from "./test";
import TextToSVG, { load } from "text-to-svg";

const LyricsContext = createContext<{ tts: TextToSVG } | undefined>(undefined);

export function useLyrics() {
  return useContext(LyricsContext)!;
}

export function Lyrics() {
  const [tts, setTTS] = useState<TextToSVG>();

  useEffect(() => {
    load("/sm.ttf", (err, textToSvg) => {
      if (err != null || textToSvg == null)
        throw new Error("Failed to load font");

      setTTS(textToSvg);
    });
  }, []);

  if (tts == null) return <></>;

  return (
    <LyricsContext.Provider value={{ tts }}>
      <Test delay={0} text="「死にたいなんて言うなよ。」" />
      <Test delay={7 * 300} text="「諦めないで生きろよ。」" />
      <Test delay={14 * 300} text="そんな歌が正しいなんて" />
      <Test delay={20 * 300} text="馬鹿げてるよな。" />
    </LyricsContext.Provider>
  );
}
