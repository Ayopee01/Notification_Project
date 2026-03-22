import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "",
  output: "standalone",
  trailingSlash: false,

  images: {
    remotePatterns: [
      // ถ้า URL รูปมีโดเมนอื่น/ http ให้เพิ่มได้ เช่น
      // protocol: "http", 
      // hostname: "www.tmd.go.th", 
      // pathname: "/media/**",
    ],
  },
};

export default nextConfig;
