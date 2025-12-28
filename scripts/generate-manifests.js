// scripts/generate-manifests.js - VERSION ULTRA-ROBUSTE
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 🛡️ ERROR HANDLING UTILITIES
// ==========================================

let errorCount = 0;
const errors = [];

function logError(context, error, data = {}) {
  errorCount++;
  const errorLog = {
    context,
    message: error.message,
    ...data,
    timestamp: new Date().toISOString()
  };
  errors.push(errorLog);
  console.error(`❌ [${context}] ${error.message}`, data);
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  if (errorCount === 0) {
    console.log('✅ Manifest generation completed successfully!');
  } else {
    console.log(`⚠️  Manifest generation completed with ${errorCount} error(s)`);
    console.log('\nErrors summary:');
    errors.forEach((err, i) => {
      console.log(`  ${i + 1}. [${err.context}] ${err.message}`);
    });
  }
  console.log('='.repeat(60) + '\n');
}

// ==========================================
// 🔒 SAFE FILE OPERATIONS
// ==========================================

/**
 * Créer un répertoire de manière sécurisée
 */
function safeCreateDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
      return true;
    }
    return true;
  } catch (error) {
    logError('create_directory', error, { dirPath });
    return false;
  }
}

/**
 * Lire un répertoire de manière sécurisée
 */
function safeReadDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.warn(`⚠️  Directory does not exist: ${dirPath}`);
      return null;
    }
    
    const files = fs.readdirSync(dirPath);
    return files;
  } catch (error) {
    logError('read_directory', error, { dirPath });
    return null;
  }
}

/**
 * Écrire un fichier de manière sécurisée
 */
function safeWriteFile(filePath, content) {
  try {
    // Créer le répertoire parent si nécessaire
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Valider le contenu
    if (typeof content !== 'string') {
      throw new Error('Content must be a string');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    logError('write_file', error, { filePath });
    return false;
  }
}

/**
 * Valider un fichier markdown
 */
function validateMarkdownFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    
    // Vérifier la taille (min 100 bytes, max 5MB)
    if (stats.size < 100) {
      console.warn(`⚠️  File too small (${stats.size} bytes): ${filePath}`);
      return false;
    }
    
    if (stats.size > 5 * 1024 * 1024) {
      console.warn(`⚠️  File too large (${stats.size} bytes): ${filePath}`);
      return false;
    }
    
    // Vérifier le contenu
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Doit contenir du frontmatter
    if (!content.includes('---') || !content.includes('title:')) {
      console.warn(`⚠️  Invalid markdown format: ${filePath}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn(`⚠️  Cannot validate file: ${filePath}`, error.message);
    return false;
  }
}

// ==========================================
// 📝 MANIFEST GENERATION
// ==========================================

/**
 * Générer manifest pour blog
 */
function generateBlogManifests(contentDir) {
  console.log('\n📰 Generating blog manifests...');
  
  const blogDir = path.join(contentDir, 'blog');
  
  if (!safeCreateDir(blogDir)) {
    return;
  }
  
  ['en', 'es'].forEach(lang => {
    const langDir = path.join(blogDir, lang);
    
    if (!safeCreateDir(langDir)) {
      return;
    }
    
    const allFiles = safeReadDir(langDir);
    
    if (!allFiles) {
      console.warn(`⚠️  Cannot read blog/${lang} directory`);
      return;
    }
    
    // Filtrer et valider les fichiers
    const validFiles = [];
    const invalidFiles = [];
    
    allFiles.forEach(file => {
      // Ignorer manifest.json et autres fichiers non-MD
      if (!file.endsWith('.md')) {
        return;
      }
      
      const filePath = path.join(langDir, file);
      
      if (validateMarkdownFile(filePath)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });
    
    // Trier par date (plus récent en premier)
    const sortedFiles = validFiles.sort((a, b) => {
      // Extraire la date du nom de fichier: YYYY-MM-DD-slug.md
      const dateA = a.split('-').slice(0, 3).join('-');
      const dateB = b.split('-').slice(0, 3).join('-');
      return dateB.localeCompare(dateA);
    });
    
    // Créer le manifest
    const manifest = {
      files: sortedFiles,
      count: sortedFiles.length,
      lastUpdated: new Date().toISOString(),
      language: lang,
      validFiles: sortedFiles.length,
      invalidFiles: invalidFiles.length
    };
    
    // Sauvegarder
    const manifestPath = path.join(langDir, 'manifest.json');
    const success = safeWriteFile(
      manifestPath, 
      JSON.stringify(manifest, null, 2)
    );
    
    if (success) {
      console.log(`✅ Blog (${lang}): ${sortedFiles.length} posts`);
      if (invalidFiles.length > 0) {
        console.warn(`   ⚠️  ${invalidFiles.length} invalid files skipped`);
      }
    }
  });
}

/**
 * Générer manifest pour museum
 */
function generateMuseumManifests(contentDir) {
  console.log('\n🏛️  Generating museum manifests...');
  
  const museumDir = path.join(contentDir, 'museum');
  
  if (!safeCreateDir(museumDir)) {
    return;
  }
  
  ['en', 'es'].forEach(lang => {
    const langDir = path.join(museumDir, lang);
    
    if (!safeCreateDir(langDir)) {
      return;
    }
    
    const allFiles = safeReadDir(langDir);
    
    if (!allFiles) {
      console.warn(`⚠️  Cannot read museum/${lang} directory`);
      return;
    }
    
    // Filtrer et valider les fichiers
    const validFiles = [];
    const invalidFiles = [];
    
    allFiles.forEach(file => {
      if (!file.endsWith('.md')) {
        return;
      }
      
      const filePath = path.join(langDir, file);
      
      if (validateMarkdownFile(filePath)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });
    
    // Trier alphabétiquement (l'ordre sera géré par le champ 'order')
    const sortedFiles = validFiles.sort();
    
    // Créer le manifest
    const manifest = {
      files: sortedFiles,
      count: sortedFiles.length,
      lastUpdated: new Date().toISOString(),
      language: lang,
      validFiles: sortedFiles.length,
      invalidFiles: invalidFiles.length
    };
    
    // Sauvegarder
    const manifestPath = path.join(langDir, 'manifest.json');
    const success = safeWriteFile(
      manifestPath, 
      JSON.stringify(manifest, null, 2)
    );
    
    if (success) {
      console.log(`✅ Museum (${lang}): ${sortedFiles.length} artworks`);
      if (invalidFiles.length > 0) {
        console.warn(`   ⚠️  ${invalidFiles.length} invalid files skipped`);
      }
    }
  });
}

/**
 * Main function
 */
function generateManifests() {
  console.log('🚀 Starting manifest generation...\n');
  
  const contentDir = path.join(__dirname, '../public/content');
  
  // Vérifier que le répertoire content existe
  if (!safeCreateDir(contentDir)) {
    console.error('❌ Failed to create content directory');
    process.exit(1);
  }
  
  try {
    // Générer les manifests
    generateBlogManifests(contentDir);
    generateMuseumManifests(contentDir);
    
    // Afficher le résumé
    printSummary();
    
    // Exit code basé sur les erreurs
    process.exit(errorCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Fatal error during manifest generation:', error);
    process.exit(1);
  }
}

// Run
generateManifests();