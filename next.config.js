/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
