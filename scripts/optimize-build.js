const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Configuration pour l'optimisation
const NEXT_OUTPUT_DIR = '.next';
const STATIC_DIR = path.join(NEXT_OUTPUT_DIR, 'static');

// Fonction pour minifier les fichiers JS additionnels
async function minifyJavaScript() {
  console.log('🔧 Optimisation des fichiers JavaScript...');
  
  try {
    const staticChunks = path.join(STATIC_DIR, 'chunks');
    if (!fs.existsSync(staticChunks)) {
      console.log('⚠️  Dossier chunks non trouvé, ignorer la minification JS');
      return;
    }
    
    const files = fs.readdirSync(staticChunks, { recursive: true });
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    let totalSaved = 0;
    
    for (const file of jsFiles) {
      const filePath = path.join(staticChunks, file);
      if (fs.statSync(filePath).isFile()) {
        const originalCode = fs.readFileSync(filePath, 'utf8');
        const originalSize = originalCode.length;
        
        const minified = await minify(originalCode, {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            reduce_vars: true,
            unused: true,
            dead_code: true,
          },
          mangle: {
            toplevel: true,
          },
          format: {
            comments: false,
          },
        });
        
        if (minified.code) {
          const newSize = minified.code.length;
          const saved = originalSize - newSize;
          totalSaved += saved;
          
          fs.writeFileSync(filePath, minified.code);
          console.log(`✅ Optimisé ${file}: ${(saved / 1024).toFixed(1)} KB économisés`);
        }
      }
    }
    
    console.log(`🎉 Total JS optimisé: ${(totalSaved / 1024).toFixed(1)} KB économisés`);
  } catch (error) {
    console.error('❌ Erreur lors de la minification JS:', error.message);
  }
}

// Fonction pour optimiser les fichiers CSS
function optimizeCSS() {
  console.log('🎨 Optimisation des fichiers CSS...');
  
  try {
    const staticCSS = path.join(STATIC_DIR, 'css');
    if (!fs.existsSync(staticCSS)) {
      console.log('⚠️  Dossier CSS non trouvé, ignorer l\'optimisation CSS');
      return;
    }
    
    const files = fs.readdirSync(staticCSS);
    const cssFiles = files.filter(file => file.endsWith('.css'));
    
    let totalSaved = 0;
    
    for (const file of cssFiles) {
      const filePath = path.join(staticCSS, file);
      const originalCSS = fs.readFileSync(filePath, 'utf8');
      const originalSize = originalCSS.length;
      
      // Optimisations CSS basiques
      let optimizedCSS = originalCSS
        // Supprimer les commentaires
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Supprimer les espaces en trop
        .replace(/\s+/g, ' ')
        // Supprimer les espaces autour des opérateurs
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Supprimer les trailing spaces
        .trim();
      
      const newSize = optimizedCSS.length;
      const saved = originalSize - newSize;
      totalSaved += saved;
      
      fs.writeFileSync(filePath, optimizedCSS);
      console.log(`✅ Optimisé ${file}: ${(saved / 1024).toFixed(1)} KB économisés`);
    }
    
    console.log(`🎉 Total CSS optimisé: ${(totalSaved / 1024).toFixed(1)} KB économisés`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation CSS:', error.message);
  }
}

// Fonction pour analyser la taille des bundles
function analyzeBundles() {
  console.log('📊 Analyse de la taille des bundles...');
  
  try {
    const buildManifest = path.join(NEXT_OUTPUT_DIR, 'build-manifest.json');
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      
      console.log('\n📈 Taille des pages principales:');
      for (const [page, files] of Object.entries(manifest.pages)) {
        let totalSize = 0;
        for (const file of files) {
          const filePath = path.join(NEXT_OUTPUT_DIR, file);
          if (fs.existsSync(filePath)) {
            totalSize += fs.statSync(filePath).size;
          }
        }
        console.log(`  ${page}: ${(totalSize / 1024).toFixed(1)} KB`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error.message);
  }
}

// Fonction pour supprimer les source maps en production
function removeSourceMaps() {
  console.log('🗺️  Suppression des source maps...');
  
  try {
    const removeMapFiles = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir, { recursive: true });
      let removed = 0;
      
      for (const file of files) {
        if (file.endsWith('.map')) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            removed++;
          }
        }
      }
      
      return removed;
    };
    
    const staticRemoved = removeMapFiles(STATIC_DIR);
    console.log(`✅ ${staticRemoved} fichiers .map supprimés`);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des source maps:', error.message);
  }
}

// Fonction principale
async function optimize() {
  console.log('🚀 Début de l\'optimisation du build...\n');
  
  // Vérifier que le build existe
  if (!fs.existsSync(NEXT_OUTPUT_DIR)) {
    console.error('❌ Dossier .next non trouvé. Veuillez d\'abord exécuter "npm run build"');
    process.exit(1);
  }
  
  // Exécuter les optimisations
  await minifyJavaScript();
  optimizeCSS();
  removeSourceMaps();
  analyzeBundles();
  
  console.log('\n🎉 Optimisation terminée avec succès!');
  console.log('💡 Conseils supplémentaires:');
  console.log('  - Utilisez "npm run analyze" pour analyser les bundles');
  console.log('  - Vérifiez que vos images sont optimisées (WebP/AVIF)');
  console.log('  - Considérez l\'utilisation d\'un CDN pour les assets statiques');
}

// Exécuter l'optimisation
if (require.main === module) {
  optimize().catch(console.error);
}

module.exports = { optimize }; 