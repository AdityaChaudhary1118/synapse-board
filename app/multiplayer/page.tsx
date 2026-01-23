"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
// FIX: Use relative path
import MultiplayerEditorM from "../../components/MultiplayerEditorM"; 

export default function MultiplayerPage() {
  // FIX: Match the exact name in your .env.local file
  const apiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold p-10 text-center">
        ⚠️ Error: API Key missing.<br/>
        Check .env.local for NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
      </div>
    );
  }

  return (
    <LiveblocksProvider publicApiKey={apiKey}>
      <RoomProvider id="synapse-room-m" initialPresence={{}}>
        <ClientSideSuspense fallback={<div className="flex h-screen w-screen items-center justify-center font-bold text-gray-500">Connecting to Multiplayer... 🔌</div>}>
          {() => <MultiplayerEditorM />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}