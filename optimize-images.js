const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración de optimización
const config = {
  // Imágenes del hero (background-index) - máximo 1920px de ancho
  hero: {
    maxWidth: 1920,
    quality: 95, // Calidad alta para mantener buena calidad visual
    format: 'jpeg'
  },
  // Imágenes de página (entorno-page, habitaciones-page) - máximo 1920px
  pageHero: {
    maxWidth: 1920,
    quality: 95, // Calidad alta para mantener buena calidad visual
    format: 'jpeg'
  },
  // Imágenes de cards/thumbnails - máximo 800px
  cards: {
    maxWidth: 800,
    quality: 100, // Calidad alta para thumbnails
    format: 'jpeg'
  },
  // PNGs - mantener formato pero optimizar
  png: {
    quality: 100,
    compressionLevel: 9
  }
};

// Función para optimizar una imagen
async function optimizeImage(inputPath, options) {
  try {
    // Obtener tamaño original
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    
    // Crear ruta temporal para la salida
    const tempPath = inputPath + '.tmp';
    
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`\n📸 Procesando: ${path.basename(inputPath)}`);
    console.log(`   Tamaño original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Dimensiones: ${metadata.width}x${metadata.height}`);
    
    let pipeline = image;
    
    // Redimensionar si es necesario
    if (options.maxWidth && metadata.width > options.maxWidth) {
      pipeline = pipeline.resize(options.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
      console.log(`   Redimensionando a máximo ${options.maxWidth}px de ancho`);
    }
    
    // Aplicar optimización según formato
    if (options.format === 'jpeg') {
      pipeline = pipeline.jpeg({ 
        quality: options.quality,
        mozjpeg: true // Mejor compresión
      });
    } else if (options.format === 'webp') {
      pipeline = pipeline.webp({ 
        quality: options.quality 
      });
    } else if (options.format === 'png') {
      pipeline = pipeline.png({ 
        quality: options.pngQuality || options.quality,
        compressionLevel: options.compressionLevel || 9
      });
    }
    
    // Escribir a archivo temporal
    await pipeline.toFile(tempPath);
    
    // Reemplazar el archivo original
    fs.renameSync(tempPath, inputPath);
    
    const outputStats = fs.statSync(inputPath);
    const optimizedSize = outputStats.size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    console.log(`   ✅ Tamaño optimizado: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   💾 Ahorro: ${savings}%`);
    
    return {
      original: originalSize,
      optimized: optimizedSize,
      savings: savings
    };
  } catch (error) {
    console.error(`   ❌ Error procesando ${inputPath}:`, error.message);
    // Limpiar archivo temporal si existe
    const tempPath = inputPath + '.tmp';
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return null;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando optimización de imágenes...\n');
  
  const publicDir = path.join(__dirname, 'public');
  const backupDir = path.join(__dirname, 'public-backup');
  
  // Crear backup de las imágenes originales
  console.log('📦 Creando backup de imágenes originales...');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    fs.mkdirSync(path.join(backupDir, 'background-index'), { recursive: true });
    
    // Copiar todas las imágenes
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    function copyImages(src, dest) {
      const files = fs.readdirSync(src);
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyImages(srcPath, destPath);
        } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
    
    copyImages(publicDir, backupDir);
    console.log('✅ Backup creado en: public-backup/\n');
  } else {
    console.log('⚠️  El directorio backup ya existe. Continuando...\n');
  }
  
  const results = [];
  
  // Optimizar imágenes del hero (background-index)
  console.log('🎨 Optimizando imágenes del hero slideshow...');
  const backgroundIndexDir = path.join(publicDir, 'background-index');
  for (let i = 1; i <= 6; i++) {
    const inputPath = path.join(backgroundIndexDir, `${i}.jpg`);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, config.hero);
      if (result) results.push(result);
    }
  }
  
  // Optimizar imágenes de página hero
  console.log('\n🖼️  Optimizando imágenes de página hero...');
  const pageHeroImages = [
    'entorno-page.jpg',
    'habitaciones-page.jpg',
    'background.jpg'
  ];
  
  for (const imageName of pageHeroImages) {
    const inputPath = path.join(publicDir, imageName);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, config.pageHero);
      if (result) results.push(result);
    }
  }
  
  // Optimizar imágenes de cards
  console.log('\n🃏 Optimizando imágenes de cards...');
  const cardImages = [
    'entorno.jpg',
    'habitaciones.jpg',
    'cafeteria.jpg',
    'costa-brava.jpg',
    'back-home.jpg'
  ];
  
  for (const imageName of cardImages) {
    const inputPath = path.join(publicDir, imageName);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, config.cards);
      if (result) results.push(result);
    }
  }
  
  // Optimizar PNGs
  console.log('\n🖼️  Optimizando imágenes PNG...');
  const pngImages = [
    'gaviota.png',
    'blumen-mobile.png',
    'protolab-logo.png'
  ];
  
  for (const imageName of pngImages) {
    const inputPath = path.join(publicDir, imageName);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, {
        ...config.png,
        format: 'png'
      });
      if (result) results.push(result);
    }
  }
  
  // Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('='.repeat(50));
  
  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
    const totalOptimized = results.reduce((sum, r) => sum + r.optimized, 0);
    const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    
    console.log(`\n📦 Total de imágenes procesadas: ${results.length}`);
    console.log(`📏 Tamaño total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📏 Tamaño total optimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Ahorro total: ${totalSavings}% (${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`\n✅ ¡Optimización completada!`);
    console.log(`\n💡 Las imágenes originales están respaldadas en: public-backup/`);
  } else {
    console.log('\n⚠️  No se procesaron imágenes.');
  }
}

// Ejecutar
main().catch(console.error);

