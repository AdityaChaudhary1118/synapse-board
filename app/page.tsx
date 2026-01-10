"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

// FIX 1: If this line is still red, try changing "@/" to "../"
import { MakeRealButton } from "../components/MakeRealButton";
import { RoomProvider } from "./liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { useYjsStore } from "./useYjsStore";

function MultiplayerBoard() {
  const store = useYjsStore({ roomId: "synapse-room-1" });

  return (
    <div className="w-screen h-screen relative">
      {/* The Fix: 
         We moved <MakeRealButton /> from here...
         ...to INSIDE the <Tldraw> tags below.
      */}

      <Tldraw store={store}>
        <MakeRealButton />
      </Tldraw>
    </div>
  );
}

export default function Home() {
  return (
    <RoomProvider id="synapse-room-1" initialPresence={{}}>
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
