"use client";

// 1. Import dynamic from Next.js
import dynamic from "next/dynamic";
import "tldraw/tldraw.css";
import { MakeRealButton } from "@/components/MakeRealButton"; 

// 2. The Magic Fix: Load Tldraw with SSR disabled
const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false, // This tells Next.js: "Don't touch this on the server!"
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center text-xl font-bold">
      Loading Whiteboard... 🎨
    </div>
  ),
});

export default function Home() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100">
        <Tldraw>
            <MakeRealButton />
        </Tldraw>
    </div>
  );
}