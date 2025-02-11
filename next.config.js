/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iuupjehwangxcqvcgkrb.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
