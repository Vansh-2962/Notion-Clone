import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s5754bdveh.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
}

export default nextConfig
