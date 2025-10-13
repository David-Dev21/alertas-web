import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar React StrictMode para testing
  reactStrictMode: false,
  // Permitir orígenes específicos para solicitudes de desarrollo
  allowedDevOrigins: ["jupiter-guardian.policia.bo"],
};

export default nextConfig;
