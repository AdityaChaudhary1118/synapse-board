"use client";

import { useEditor } from "tldraw";
import { useState, useCallback } from "react";

export function MakeRealButton() {
  const editor = useEditor();
  const [loading, setLoading] = useState(false);

  const handleMakeReal = useCallback(async () => {
    setLoading(true);
    try {
      const selectedShapes = editor.getSelectedShapes();
      if (selectedShapes.length === 0) {
        window.alert("Select something to Make Real! 🖱️");
        return;
      }

      // 1. Get SVG
      const svg = await editor.getSvg(selectedShapes, { scale: 1, background: true });
      if (!svg) throw new Error("Could not generate image.");
      const svgString = new XMLSerializer().serializeToString(svg);

      // 2. Send to Gemini
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: svgString }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const data = await response.json();

      // 3. ✨ MAGIC: Open the result in a new tab immediately
      const blob = new Blob([data.code], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

    } catch (e: any) {
      console.error(e);
      window.alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [editor]);

  return (
    <button
      onClick={handleMakeReal}
      disabled={loading}
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[2000]
        flex items-center gap-3 px-8 py-3 rounded-full 
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        text-white font-bold text-lg shadow-2xl
        hover:scale-105 hover:shadow-indigo-500/50 
        active:scale-95 transition-all duration-300 ease-in-out
        ${loading ? "opacity-75 cursor-wait" : "opacity-100"}
      `}
    >
      {loading ? <span className="animate-spin text-xl">⏳</span> : <span className="text-xl">✨</span>}
      <span>{loading ? "Designing..." : "Make Real"}</span>
    </button>
  );
}