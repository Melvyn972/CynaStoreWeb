module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Minification CSS avancée pour la production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // Optimisations sûres
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyParams: true,
          minifyFontValues: true,
          colormin: true,
          convertValues: true,
          calc: true,
          mergeRules: true,
          mergeLonghand: true,
          autoprefixer: false, // Déjà géré par autoprefixer
        }],
      },
    }),
  },
}
