const MillionLint = require("@million/lint");
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "michaelokoye-nextjs-demo-users-image.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = MillionLint.next({
  enabled: true,
  rsc: true,
})(nextConfig);
