/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add other Next.js config options here
  // For example, to allow images from external domains:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // port: '', // Optional
        // pathname: '/account123/**', // Optional
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   typedRoutes: true, // If you want typed routes
  // },
};

export default nextConfig;
