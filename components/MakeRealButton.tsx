import { useEditor, toRichText } from "tldraw"; // FIX 1: Import toRichText
import { useState } from "react";

export function MakeRealButton() {
  const editor = useEditor();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const shapeIds = Array.from(editor.getCurrentPageShapeIds());
      if (shapeIds.length === 0) {
        alert("Please draw something first!");
        return;
      }

      // Get the image
      const { blob } = await editor.toImage(shapeIds, {
        format: "png",
        scale: 1,
        background: true,
      });

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Send to AI
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64data }),
        });

        const html = await response.text();

        // FIX 2: Use 'geo' shape (Rectangle) instead of 'text'
        // FIX 3: Use 'richText' property instead of 'text'
        editor.createShape({
          type: "geo",
          x: 500,
          y: 0,
          props: {
            geo: "rectangle",
            w: 500,
            h: 600,
            richText: toRichText(html), // The Magic Fix 🪄
          },
        });
      };
    } catch (e) {
      console.error(e);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-2 right-2 z-[99999] bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 pointer-events-auto"
    >
      {loading ? "Generating..." : "Make Real ✨"}
    </button>
  );
}
