const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  
  // Désactiver temporairement ESLint pour les tests d'optimisation
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuration pour améliorer l'hydratation et optimiser les imports
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react', '@headlessui/react'],
    // Améliorer le cache pour le back/forward
    scrollRestoration: true,
  },
  
  // Configuration pour réduire les problèmes d'hydratation et minifier
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    // Minifier CSS automatiquement
    styledComponents: true,
  },
  
  // Configuration d'optimisation des images
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 heures pour améliorer le cache
    // Optimiser les images pour le LCP
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configuration avancée pour optimiser les chunks et réduire le JavaScript inutilisé
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Optimisation du chunking pour réduire le JavaScript inutilisé
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                enforce: true,
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                enforce: true,
              },
            },
          },
        };
      }
    }
    
    // Minification CSS/JS avancée
    if (!dev) {
      config.optimization.minimize = true;
    }
    
    return config;
  },
  
  // Headers pour améliorer le cache et éviter les problèmes de back/forward cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Compression pour réduire la taille des assets
  compress: true,
  
  // Configuration pour améliorer le LCP
  output: 'standalone',
  
  // Optimiser les polyfills pour éviter le JavaScript legacy
  swcMinify: true,
};

module.exports = withBundleAnalyzer(nextConfig);
