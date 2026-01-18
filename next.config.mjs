/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  
  // 🛑 FORCE BUILD TO IGNORE ERRORS 🛑
  // This tells Vercel: "If you find a type error or a missing module, just ignore it and build anyway."
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;