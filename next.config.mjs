/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'miraculous-agreement-441a168338.media.strapiapp.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;