"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Sequence } from "@/components/sequence";
import { WriteChar } from "@/components/char";
import TextToSVG from "@/lib/text-to-svg";
import { StyleProvider } from "@/components/context";

const LyricsContext = createContext<{ tts: TextToSVG } | undefined>(undefined);

export function useLyrics() {
  return useContext(LyricsContext)!;
}

export function Lyrics() {
  const [tts, setTTS] = useState<TextToSVG>();

  useEffect(() => {
    TextToSVG.load("/sm.ttf")
      .then((res) => setTTS(res))
      .catch((err) => {
        throw err;
      });
  }, []);

  if (tts == null) return <></>;

  return (
    <LyricsContext.Provider value={{ tts }}>
      <StyleProvider vertical fontSize={50}>
        <Sequence
          comp={WriteChar}
          chars="「死にたいなんて言うなよ。」"
          preDraw={500}
          duration={1000 * 10}
          position={(x, y) => [20, y + 70]}
        />
        <Sequence
          comp={WriteChar}
          chars="「諦めないで生きろよ。」"
          preDraw={500}
          delay={1000 * 3}
          duration={1000 * 9}
          position={(x, y) => [80, y + 70]}
        />
        <Sequence
          comp={WriteChar}
          chars="そんな歌が正しいなんて馬鹿げてるよな。"
          preDraw={500}
          delay={1000 * 6}
          duration={1000 * 12}
          position={(x, y) => [300, y + 70]}
        />
      </StyleProvider>
    </LyricsContext.Provider>
  );
}
