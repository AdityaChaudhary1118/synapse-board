"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR completely disabled
const TldrawWrapper = dynamic(() => import("@/components/TldrawWrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center font-bold text-xl text-gray-500">
      Loading Synapse Board... 🚀
    </div>
  ),
});

export default function Home() {
  return (
    <div className="fixed inset-0 bg-white">
      <TldrawWrapper />
    </div>
  );
}