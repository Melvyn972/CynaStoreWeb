const fs = require('fs');
const path = require('path');

// Fonction pour analyser le CSS utilisé dans les composants
function analyzeCSSUsage() {
  console.log('🎨 Analyse de l\'utilisation du CSS...\n');
  
  const cssClasses = new Set();
  const usedClasses = new Set();
  
  // Lire le fichier CSS global
  const globalCSSPath = path.join(__dirname, '../app/globals.css');
  if (fs.existsSync(globalCSSPath)) {
    const cssContent = fs.readFileSync(globalCSSPath, 'utf8');
    
    // Extraire les classes CSS personnalisées (non-Tailwind)
    const classRegex = /\.([a-zA-Z-_][a-zA-Z0-9-_]*)\s*{/g;
    let match;
    while ((match = classRegex.exec(cssContent)) !== null) {
      cssClasses.add(match[1]);
    }
    
    console.log(`📋 Trouvé ${cssClasses.size} classes CSS personnalisées`);
  }
  
  // Analyser les fichiers JS/JSX pour les classes utilisées
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir, { recursive: true });
    
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Chercher les références aux classes CSS
          for (const className of cssClasses) {
            if (content.includes(className)) {
              usedClasses.add(className);
            }
          }
        }
      }
    }
  }
  
  // Scanner les répertoires principaux
  scanDirectory(path.join(__dirname, '../app'));
  scanDirectory(path.join(__dirname, '../components'));
  scanDirectory(path.join(__dirname, '../pages'));
  
  const unusedClasses = [...cssClasses].filter(cls => !usedClasses.has(cls));
  
  console.log(`✅ Classes utilisées: ${usedClasses.size}`);
  console.log(`❌ Classes non utilisées: ${unusedClasses.length}`);
  
  if (unusedClasses.length > 0) {
    console.log('\n🗑️  Classes CSS non utilisées détectées:');
    unusedClasses.forEach(cls => console.log(`  - .${cls}`));
    
    console.log('\n💡 Pour optimiser, vous pouvez supprimer ces classes du CSS global.');
  } else {
    console.log('\n🎉 Aucune classe CSS inutilisée détectée!');
  }
  
  return { usedClasses: Array.from(usedClasses), unusedClasses };
}

// Fonction pour optimiser les imports Tailwind
function optimizeTailwindImports() {
  console.log('\n🎯 Optimisation des imports Tailwind...');
  
  const tailwindConfigPath = path.join(__dirname, '../tailwind.config.js');
  if (fs.existsSync(tailwindConfigPath)) {
    const configContent = fs.readFileSync(tailwindConfigPath, 'utf8');
    
    // Vérifier si le purge/content est bien configuré
    if (configContent.includes('content:') || configContent.includes('purge:')) {
      console.log('✅ Configuration Tailwind purge trouvée');
      
      // Suggestions d'optimisation
      console.log('\n💡 Suggestions d\'optimisation Tailwind:');
      console.log('  - Assurez-vous que tous les fichiers sont inclus dans le content');
      console.log('  - Considérez l\'utilisation de safelist pour les classes dynamiques');
      console.log('  - Utilisez des composants réutilisables pour réduire la duplication');
    } else {
      console.log('⚠️  Configuration purge Tailwind non trouvée - CSS potentiellement non optimisé');
    }
  }
}

// Fonction pour analyser la taille des CSS
function analyzeCSSSize() {
  console.log('\n📊 Analyse de la taille des fichiers CSS...');
  
  const nextStaticCSS = path.join(__dirname, '../.next/static/css');
  if (fs.existsSync(nextStaticCSS)) {
    const files = fs.readdirSync(nextStaticCSS);
    const cssFiles = files.filter(file => file.endsWith('.css'));
    
    let totalSize = 0;
    cssFiles.forEach(file => {
      const filePath = path.join(nextStaticCSS, file);
      const size = fs.statSync(filePath).size;
      totalSize += size;
      console.log(`  ${file}: ${(size / 1024).toFixed(1)} KB`);
    });
    
    console.log(`\n📈 Taille totale CSS: ${(totalSize / 1024).toFixed(1)} KB`);
    
    if (totalSize > 50 * 1024) { // Plus de 50KB
      console.log('⚠️  Taille CSS importante - considérez l\'optimisation');
    } else {
      console.log('✅ Taille CSS optimale');
    }
  } else {
    console.log('⚠️  Dossier CSS de build non trouvé - exécutez d\'abord "npm run build"');
  }
}

// Fonction principale
function main() {
  console.log('🚀 Analyse CSS et optimisation...\n');
  
  try {
    const analysis = analyzeCSSUsage();
    optimizeTailwindImports();
    analyzeCSSSize();
    
    console.log('\n🎉 Analyse terminée!');
    
    // Créer un rapport
    const report = {
      timestamp: new Date().toISOString(),
      usedClasses: analysis.usedClasses.length,
      unusedClasses: analysis.unusedClasses.length,
      unusedClassesList: analysis.unusedClasses,
    };
    
    const reportPath = path.join(__dirname, '../.next/css-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Rapport sauvegardé dans: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeCSSUsage, optimizeTailwindImports, analyzeCSSSize }; 