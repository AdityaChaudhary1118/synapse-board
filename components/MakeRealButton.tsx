"use client";

import { useEditor } from "tldraw";
import { useCallback } from "react";

export function MakeRealButton() {
  const editor = useEditor();

  const handleMakeReal = useCallback(async () => {
    try {
      // 1. Get the selected shapes
      const selectedShapes = editor.getSelectedShapes();
      if (selectedShapes.length === 0) {
        window.alert("Select something to Make Real! 🖌️");
        return;
      }

      // 2. Send to AI (your existing logic)
      console.log("Making Real...");
      // Add your actual "makeReal" function call here if it's external,
      // or keep using the logic you had before. 
      // This button just triggers the UI for now.
      
      // Placeholder for the actual API call logic from your previous setup:
      // await makeReal(editor); 

    } catch (e) {
      console.error(e);
      window.alert("Something went wrong! Check console.");
    }
  }, [editor]);

  return (
    <button
      onClick={handleMakeReal}
      className="absolute bottom-4 right-4 z-[9999] 
                 bg-gradient-to-r from-blue-600 to-violet-600 
                 hover:from-blue-500 hover:to-violet-500
                 text-white font-bold py-3 px-6 rounded-xl 
                 shadow-lg hover:shadow-xl hover:scale-105 
                 transition-all duration-200 ease-in-out
                 flex items-center gap-2 pointer-events-auto"
    >
      <span>✨ Make Real</span>
    </button>
  );
}