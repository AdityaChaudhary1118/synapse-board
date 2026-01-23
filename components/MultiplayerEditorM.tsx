"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
// FIX: Use relative path
import { useYjsStoreM } from "../hooks/useYjsStoreM"; 
import { MakeRealButton } from "./MakeRealButton";

export default function MultiplayerEditorM() {
  const store = useYjsStoreM({});

  return (
    <div className="fixed inset-0 h-screen w-screen">
      <Tldraw store={store}>
        <MakeRealButton />
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow z-[3000]">
           🟣 Multiplayer (M)
        </div>
      </Tldraw>
    </div>
  );
}