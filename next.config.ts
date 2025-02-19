import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', 
    },
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
