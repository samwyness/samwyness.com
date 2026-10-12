/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // Always inlined, even unset, so builds without it drop the hero effect
    // lab entirely. See HeroPhoto.tsx
    NEXT_PUBLIC_HERO_FX_LAB: process.env.NEXT_PUBLIC_HERO_FX_LAB ?? '',
  },
  // Baseline hardening. Vercel already sends HSTS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
