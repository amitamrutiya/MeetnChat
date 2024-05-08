/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "s.gravatar.com",
      "lh3.googleusercontent.com",
      "github.com",
      "api.dicebear.com",
    ],
    formats: ['image/avif', 'image/webp'],
    loader: 'default',
    path: '/_next/image',
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
