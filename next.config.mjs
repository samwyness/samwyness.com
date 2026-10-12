/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // Always inlined, even unset, so builds without it drop the hero effect
    // lab entirely. See HeroPhoto.tsx
    NEXT_PUBLIC_HERO_FX_LAB: process.env.NEXT_PUBLIC_HERO_FX_LAB ?? '',
  },
};

export default nextConfig;
