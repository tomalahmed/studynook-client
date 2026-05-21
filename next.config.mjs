/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "**.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "i.imgur.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:5000";
    return [
      {
        source: "/api/rooms/:path*",
        destination: `${apiUrl}/api/rooms/:path*`,
      },
      {
        source: "/api/bookings/:path*",
        destination: `${apiUrl}/api/bookings/:path*`,
      },
    ];
  },
};

export default nextConfig;
