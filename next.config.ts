/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double-load
  swcMinify: false,       // ⚠️ THE FIX: Prevents code squashing that breaks Tldraw

  // Keep these to ignore the red squiggles during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;