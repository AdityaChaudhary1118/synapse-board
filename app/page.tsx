"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { PreviewShapeUtil } from '@/components/PreviewShape'; 
import { MakeRealButton } from "../components/MakeRealButton"; 
import { RoomProvider } from "./liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { useYjsStore } from "./useYjsStore";

// 1. Define the custom shapes
const customShapeUtils = [PreviewShapeUtil];

function MultiplayerBoard() {
  // ✅ THE FIX IS HERE: We pass 'shapeUtils' to the store hook!
  const store = useYjsStore({ 
    roomId: "synapse-room-3", // I bumped the room ID to '3' to start fresh and clean
    shapeUtils: customShapeUtils 
  });

  return (
    <div className="w-screen h-screen relative">
      <Tldraw
        store={store}
        shapeUtils={customShapeUtils} 
      >
        <MakeRealButton />
      </Tldraw>
    </div>
  );
}

export default function Home() {
  return (
    // Make sure this ID matches the one above (synapse-room-3)
    <RoomProvider id="synapse-room-3" initialPresence={{}}>
      <ClientSideSuspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center text-xl font-bold animate-pulse">
            Connecting to Synapse Cloud... ☁️
          </div>
        }
      >
        {() => <MultiplayerBoard />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}