/** @type {import('next').NextConfig} */
const nextConfig = {
  // 这是解决问题的关键：告诉 Next.js 不要使用默认的 SWC 压缩器
  swcMinify: false, 
};

export default nextConfig;