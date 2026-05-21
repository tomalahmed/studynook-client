/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
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
