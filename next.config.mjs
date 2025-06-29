/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ciwjjfcuhubjydajazkk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/webstie-icon/**',
      },
    ],
  },
};

export default nextConfig;