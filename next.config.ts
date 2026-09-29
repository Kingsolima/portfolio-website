import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits plain HTML/CSS/JS into `out/`,
  // deployed on AWS Amplify (see amplify.yml), or any static host.
  output: "export",
  // `/blog/slug` -> `/blog/slug/index.html` so static hosts resolve nested routes.
  trailingSlash: true,
  images: {
    // The default next/image loader needs a server. This site has a handful
    // of images at most, so serve them as-is.
    unoptimized: true,
  },
};

export default nextConfig;
