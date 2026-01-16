"use client";

import dynamic from "next/dynamic";
import "tldraw/tldraw.css";
import { PreviewShapeUtil } from '@/components/PreviewShape'; 
import { RoomProvider } from "./liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { useYjsStore } from "./useYjsStore";

const customShapeUtils = [PreviewShapeUtil];

const Board = dynamic(
  async () => {
    const { Tldraw } = await import("tldraw");
    const { MakeRealButton } = await import("../components/MakeRealButton");

    return function MultiplayerBoard() {
      const store = useYjsStore({ 
        roomId: "synapse-room-production",
        shapeUtils: customShapeUtils 
      });

      return (
        <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <Tldraw
            store={store}
            shapeUtils={customShapeUtils} 
          >
            <MakeRealButton />
          </Tldraw>
        </div>
      );
    };
  },
  { ssr: false }
);

export default function Home() {
  return (
    <RoomProvider id="synapse-room-production" initialPresence={{}}>
      <ClientSideSuspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center text-xl font-bold animate-pulse">
            Loading Synapse Board... 🚀
          </div>
        }
      >
        {() => <Board />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}