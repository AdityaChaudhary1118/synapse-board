/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 1. Prevents double-loading crashes
  webpack: (config) => {
    // 2. Allow Tldraw to use its standard imports
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
};

export default nextConfig;