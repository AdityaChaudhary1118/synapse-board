"use client";

import React, { Component, ReactNode } from "react";
import dynamic from "next/dynamic";
import "tldraw/tldraw.css";

// 1. Define a "Crash Catcher" Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600 bg-white border-2 border-red-600 m-10 rounded">
          <h2 className="text-2xl font-bold mb-4">💥 The App Crashed!</h2>
          <p className="font-mono bg-gray-100 p-4 rounded">{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// 2. Load Tldraw safely
const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
  loading: () => <div className="p-10">Loading Tldraw...</div>,
});

export default function Home() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100">
      <ErrorBoundary>
        {/* 3. persistenceKey={null} -> PREVENTS loading old/corrupt data 
           This is often the cause of the "Vanish" bug!
        */}
        <Tldraw persistenceKey={null} />
      </ErrorBoundary>
    </div>
  );
}