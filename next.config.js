/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This tells the build to ignore all TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This tells the build to ignore linting errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
