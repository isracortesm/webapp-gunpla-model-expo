import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    domains: [
      "static.wikia.nocookie.net",
      "lwhtqgysqynugqbpisva.storage.supabase.co",
      "pjpmsspqzphwpikxfxdf.storage.supabase.co"
    ],
  },
};

export default nextConfig;
