/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', "cdn.countryflags.com", "https://media-cdn.tripadvisor.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = {
  nextConfig,
  env: {
    REACT_APP_MAPBOX_ACCESS_TOKEN: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
    REACT_APP_UNSPLASH_ACCESS_KEY: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,

  }}
