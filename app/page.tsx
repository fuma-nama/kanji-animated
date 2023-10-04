import { Lyrics } from "./lyrics";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-8 py-20 overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-8">ふまなまの Project</h1>
      <Lyrics />
    </main>
  );
}
