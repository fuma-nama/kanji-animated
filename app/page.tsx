import { Lyrics } from "./lyrics";
import { Shippori_Mincho } from "next/font/google";

const font = Shippori_Mincho({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center px-8 py-20 bg-black text-white overflow-hidden " +
        font.className
      }
    >
      <h1 className="text-2xl font-semibold mb-8">ふまなまの Project</h1>
      <Lyrics />
    </main>
  );
}
