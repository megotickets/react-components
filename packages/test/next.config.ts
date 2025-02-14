import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/react-components' : '',
  images: {
    unoptimized: true
  }
}

export default nextConfig 