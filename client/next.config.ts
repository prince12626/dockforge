import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      images: {
            remotePatterns: [
                  {
                        protocol: "https",
                        hostname: "brandslogos.com",
                  },
                  {
                        protocol: "https",
                        hostname: "logodix.com",
                  },
                  {
                        protocol: "https",
                        hostname: "upload.wikimedia.org",
                  },
                  {
                        protocol: "https",
                        hostname: "i.ibb.co",
                  },
            ],
      },
};

export default nextConfig;
