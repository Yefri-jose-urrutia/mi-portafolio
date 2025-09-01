const fs = require('fs');
const path = require('path');

// Ruta donde buscar archivos HTML
const rootDir = '../';
const faviconRelativePath = 'img/favicon.ico'; // Ubicación del favicon desde la raíz

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
      // Si es un archivo HTML, añadir el favicon
      let htmlContent = fs.readFileSync(filePath, 'utf8');
      
      // Verificar si el favicon ya existe
      if (!htmlContent.includes('rel="icon"') && !htmlContent.includes('rel="shortcut icon"')) {
        // Calcular la profundidad relativa para la ruta del favicon
        const relativePath = path.relative(rootDir, directory);
        let pathPrefix = '';
        
        // Contar niveles de profundidad para añadir '../' según sea necesario
        if (relativePath) {
          const depth = relativePath.split(path.sep).length;
          pathPrefix = '../'.repeat(depth);
        }
        
        // Construir la etiqueta del favicon con la ruta ajustada
        const adjustedFaviconTag = `<link rel="icon" type="image/x-icon" href="${pathPrefix}${faviconRelativePath}">`;
        
        // Buscar la etiqueta </head> e insertar antes
        htmlContent = htmlContent.replace('</head>', `  ${adjustedFaviconTag}\n  </head>`);
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Favicon añadido a: ${filePath} con ruta: ${pathPrefix}${faviconRelativePath}`);
      }
    }
  });
}

// Iniciar el proceso
processDirectory(rootDir);