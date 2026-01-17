"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { MakeRealButton } from "@/components/MakeRealButton"; // or "../components/..."

export default function Home() {
  return (
    <div className="w-screen h-screen relative">
       {/* OFFLINE MODE TEST 
          We removed RoomProvider and useYjsStore.
          We are just testing if Tldraw works on Vercel.
       */}
      <Tldraw>
        <MakeRealButton />
      </Tldraw>
    </div>
  );
}