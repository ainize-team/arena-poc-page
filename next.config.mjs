/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["firebasestorage.googleapis.com"],
    // remotePatterns: [
    //     // 구글로그인 프로필 이미지
    //     {
    //         protocol: 'https',
    //         hostname: 'lh3.googleusercontent.com'
    //     },
    // ]
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },

  webpack(config) {
    return config;
  },
};

export default nextConfig;
