import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar React StrictMode en producción para mejores prácticas
  reactStrictMode: true,

  // Configuración para despliegue standalone (útil para Docker)
  output: "standalone",

  images: {
    domains: ["kerveros-dev.policia.bo", "jupiter-guardian.policia.bo", "localhost"],
    unoptimized: false,
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Configuración experimental para optimizaciones
  experimental: {
    scrollRestoration: true,
  },

  // Configuración de logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
