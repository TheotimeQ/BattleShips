/** @type {import('next').NextConfig} */
const config = require('./config.json');

const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: config.api_url
      },
    ]
  }
}

module.exports = nextConfig
