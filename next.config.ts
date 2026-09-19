import type { NextConfig } from "next";

/**
 * The portal is entirely behind login, so it carries none of the marketing site's SEO
 * concerns. What it does carry is a session cookie and, shortly, payment UI — so the
 * headers matter more here than they would on a brochure.
 */
const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
