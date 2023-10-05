"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Sequence } from "@/components/sequence";
import { WriteChar } from "@/components/char";
import TextToSVG from "@/lib/text-to-svg";
import { StyleProvider } from "@/components/context";
import { AnimateCanvas } from "@/components/canv/canvas";

const LyricsContext = createContext<{ tts: TextToSVG } | undefined>(undefined);

export function useLyrics() {
  return useContext(LyricsContext)!;
}

export function Lyrics() {
  return <AnimateCanvas />;
}
