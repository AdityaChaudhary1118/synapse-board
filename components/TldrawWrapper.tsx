"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { MakeRealButton } from "./MakeRealButton"; // 1. Import enabled

export default function TldrawWrapper() {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>
      <Tldraw persistenceKey="synapse-ai-v1">
        <MakeRealButton /> {/* 2. Button enabled */}
      </Tldraw>
    </div>
  );
}