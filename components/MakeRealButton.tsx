"use client";

import { useEditor } from "tldraw";
import { useState, useCallback } from "react";

export function MakeRealButton() {
  const editor = useEditor();
  const [loading, setLoading] = useState(false);

  const handleMakeReal = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get Selected Shapes
      const selectedShapes = editor.getSelectedShapes();
      if (selectedShapes.length === 0) {
        window.alert("Please select the shapes you want to Make Real! 🖱️");
        setLoading(false);
        return;
      }

      // 2. Take a picture (SVG) of the selection
      // We export the selection as an SVG to send to the AI
      const svg = await editor.getSvg(selectedShapes, {
        scale: 1,
        background: true,
      });

      if (!svg) {
        throw new Error("Could not generate image from selection.");
      }

      // Convert SVG to String
      const svgString = new XMLSerializer().serializeToString(svg);

      // 3. Send to your API (The "Brain")
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: svgString, // We send the drawing as text
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      // 4. Handle the Result (The AI's Code)
      const data = await response.json();
      
      // OPTIONAL: Paste the result back onto the board as a shape
      // For now, we will just alert it to prove it works
      console.log("AI Response:", data);
      window.alert("Success! Check the console for the code (or update logic to display it).");

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
        flex items-center gap-3 px-8 py-3 
        rounded-full 
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        text-white font-bold text-lg shadow-2xl
        hover:scale-105 hover:shadow-indigo-500/50 
        active:scale-95 transition-all duration-300 ease-in-out
        ${loading ? "opacity-75 cursor-wait" : "opacity-100"}
      `}
    >
      {/* Icon */}
      {loading ? (
        <span className="animate-spin text-xl">⏳</span>
      ) : (
        <span className="text-xl">✨</span>
      )}
      
      {/* Text */}
      <span>{loading ? "Generating..." : "Make Real"}</span>
    </button>
  );
}