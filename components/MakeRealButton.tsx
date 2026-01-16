import { useEditor, useValue } from "tldraw";
import { useState } from "react";

export function MakeRealButton() {
  const editor = useEditor();
  const [isLoading, setIsLoading] = useState(false);

  const isSomethingSelected = useValue(
    "isSomethingSelected",
    () => editor.getSelectedShapes().length > 0,
    [editor]
  );

  async function handleMakeReal() {
    if (!isSomethingSelected) return;
    setIsLoading(true);

    try {
      console.log("🚀 Starting Generation..."); // Look for this in your browser console!
      const selectedShapes = editor.getSelectedShapeIds();
      
      const selectionBounds = editor.getSelectionPageBounds();
      if (!selectionBounds) throw new Error("No selection bounds");

      const result = await editor.toImage([...selectedShapes], {
        format: "png",
        background: true,
        padding: 20,
        scale: 1,
      });

      if (!result || !result.blob) throw new Error("Failed to generate image");

      const reader = new FileReader();
      reader.readAsDataURL(result.blob);
      
      reader.onloadend = async () => {
        const base64data = reader.result;

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64data }),
        });

        const text = await response.text();
        console.log("✅ AI Responded. Creating shape now...");

        // !!! CRITICAL PART: This MUST say 'preview' !!!
        editor.createShape({
            type: 'preview', 
            x: selectionBounds.maxX + 60, 
            y: selectionBounds.minY,      
            props: { 
                html: text,           
                w: 480,
                h: 600
            }
        });

        setIsLoading(false);
      };
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong! Check console for details.");
      setIsLoading(false);
    }
  }

  return (
    <button
      // I changed the color to PURPLE (bg-purple-600) so you can see if the file updated!
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[1000] px-6 py-2 rounded-full font-bold transition-all ${
        isSomethingSelected && !isLoading
          ? "bg-purple-600 text-white shadow-lg hover:bg-purple-700 cursor-pointer"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
      onClick={handleMakeReal}
      disabled={!isSomethingSelected || isLoading}
    >
      {isLoading ? "Generating... ⏳" : "Make Real 🔮"}
    </button>
  );
}