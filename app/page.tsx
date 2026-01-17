"use client";

import dynamic from "next/dynamic";
import "tldraw/tldraw.css";

// Lazy load Tldraw to avoid server-side crashes
const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center font-bold text-xl">
      Initializing Renderer... ⚙️
    </div>
  ),
});

export default function Home() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50">
      <Tldraw />
    </div>
  );
}