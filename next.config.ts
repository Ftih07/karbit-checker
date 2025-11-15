import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "api.dicebear.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
    ],
  },
};

export default nextConfig;
