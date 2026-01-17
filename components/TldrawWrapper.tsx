"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
// import { MakeRealButton } from "./MakeRealButton"; <--- Commented out for safety

export default function TldrawWrapper() {
  return (
    <div className="w-screen h-screen relative" style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        persistenceKey={null}
        onMount={(editor) => {
            console.log("Whiteboard Mounted!", editor);
        }}
      >
        {/* <MakeRealButton />  <--- Disabled to test if this is the cause */}
      </Tldraw>
    </div>
  );
}