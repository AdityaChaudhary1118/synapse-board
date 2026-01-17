"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { MakeRealButton } from "./MakeRealButton"; // Uncomment this

export default function TldrawWrapper() {
  return (
    <div className="w-screen h-screen relative" style={{ position: 'fixed', inset: 0 }}>
      {/* persistenceKey={null} prevents "corrupt data" crashes */}
      <Tldraw persistenceKey={null}>
        <MakeRealButton /> {/* Uncomment this */}
      </Tldraw>
    </div>
  );
}