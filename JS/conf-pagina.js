const fs = require('fs');
const path = require('path');

// Ruta donde buscar archivos HTML
const rootDir = '../';

// Función recursiva para buscar archivos HTML
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Si es un directorio, procesar recursivamente
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      // Si es un archivo HTML, eliminar números de teléfono
      let htmlContent = fs.readFileSync(filePath, 'utf8');
      let originalContent = htmlContent;
      
      // Buscar etiquetas de teléfono y eliminarlas
      htmlContent = htmlContent.replace(/<a\s+href=['"]tel:[^'"]*['"][^>]*>[^<]*<\/a>/g, '');
      
      // Buscar específicamente el número +34 603 115 557 en diferentes formatos
      const phonePatterns = [
        /\+34\s?603\s?115\s?557/g,     // El número específico
        /\+34\s?\d{3}\s?\d{3}\s?\d{3}/g, // Formato español general
        /\d{3}\s?\d{3}\s?\d{3}/g,      // Formato español sin prefijo
        /\(\+34\)\s?\d{3}\s?\d{3}\s?\d{3}/g // Otro formato español común
      ];
      
      phonePatterns.forEach(pattern => {
        htmlContent = htmlContent.replace(pattern, '');
      });
      
      // Si hubo cambios, guardar el archivo
      if (htmlContent !== originalContent) {
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Números de teléfono eliminados de: ${filePath}`);
      }
    }
  });
}

// Iniciar el proceso
processDirectory(rootDir);