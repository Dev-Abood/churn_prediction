/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/predict',
        destination: 'http://127.0.0.1:5328/api/predict', // Proxy to Flask Backend
      },
      {
        source: '/api/health',
        destination: 'http://127.0.0.1:5328/api/health', // Health check endpoint
      },
    ]
  },
}

export default nextConfig
