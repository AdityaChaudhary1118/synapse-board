"use client";

import dynamic from "next/dynamic";
import "tldraw/tldraw.css";

// 1. Force this page to skip Static Generation (Fixes "Call retries exceeded")
export const fetchCache = "force-no-store";

// 2. Load Tldraw only in the browser
const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center font-bold text-xl">
      Loading Whiteboard... 🎨
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