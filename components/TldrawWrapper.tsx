"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { MakeRealButton } from "./MakeRealButton"; 

export default function TldrawWrapper() {
  return (
    <div className="w-screen h-screen relative">
      {/* persistenceKey is omitted to prevent "corrupt data" crashes */}
      <Tldraw>
        <MakeRealButton />
      </Tldraw>
    </div>
  );
}