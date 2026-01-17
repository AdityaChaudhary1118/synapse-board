"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { MakeRealButton } from "./MakeRealButton";
// import { useYjsStore } from "@/app/useYjsStore"; <--- Commented out to stop the crash

export default function TldrawWrapper() {
  // const store = useYjsStore({ roomId: "synapse-room-1" }); <--- Commented out

  return (
    <div 
      className="relative" 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: 50,
        backgroundColor: '#fff' // White background to ensure visibility
      }}
    >
      {/* store={store} is REMOVED. This runs Tldraw in "Offline Mode" */}
      <Tldraw persistenceKey="testing-room">
        <MakeRealButton />
      </Tldraw>
    </div>
  );
}