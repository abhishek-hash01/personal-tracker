import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // config options here
};

/* 
// PWA is currently causing Turbopack build errors in Next.js 15+
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

export default process.env.NODE_ENV === 'production' ? withPWA(nextConfig) : nextConfig;
*/

export default nextConfig;
