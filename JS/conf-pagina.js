const fs = require('fs');
const path = require('path');

// Ruta base del proyecto (directorio raíz)
const rootDir = path.resolve(__dirname, '..');

// Función para determinar la profundidad de un archivo relativo al directorio raíz
function getRelativeDepth(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  return depth;
}

// Función para generar la ruta relativa correcta a script.js
function getScriptPath(depth) {
  let prefix = '';
  for (let i = 0; i < depth; i++) {
    prefix += '../';
  }
  return `${prefix}JS/script.js`;
}

// Función recursiva para procesar archivos HTML
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Si es un directorio, procesar recursivamente
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      // Procesar archivos HTML
      let htmlContent = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // 1. Verificar si ya tiene referencia a script.js
      if (!htmlContent.includes('script.js')) {
        // Determinar la profundidad para la ruta relativa
        const depth = getRelativeDepth(filePath);
        const scriptPath = getScriptPath(depth);
        
        // Añadir la referencia al script antes del cierre de body
        htmlContent = htmlContent.replace(
          '</body>',
          `  <script src="${scriptPath}"></script>\n</body>`
        );
        
        modified = true;
        console.log(`Referencia a script.js añadida en: ${filePath}`);
      }
      
      // 2. Verificar si hay scripts embebidos para el menú que deban ser eliminados
      if (htmlContent.includes('document.querySelector(\'.menu-toggle\').addEventListener(\'click\'')) {
        // Eliminar scripts embebidos del menú
        htmlContent = htmlContent.replace(
          /\s*<script>\s*\/\/\s*Menú hamburguesa.*?document\.querySelector\(\'\.menu-toggle\'\)\.addEventListener\(\'click\'.*?\}\);\s*<\/script>/s,
          ''
        );
        
        modified = true;
        console.log(`Script embebido del menú eliminado en: ${filePath}`);
      }
      
      // 3. Verificar que exista el botón del menú con la estructura correcta
      if (!htmlContent.includes('class="menu-toggle"')) {
        // Si no hay botón de menú, añadirlo después del logo
        htmlContent = htmlContent.replace(
          /<div class="logo">.*?<\/div>/s,
          match => match + '\n    <button class="menu-toggle" aria-label="Abrir menú" aria-controls="main-menu" aria-expanded="false">\n      &#9776;\n    </button>'
        );
        
        modified = true;
        console.log(`Botón de menú añadido en: ${filePath}`);
      }
      
      // 4. Verificar que exista el nav con id="main-menu"
      if (!htmlContent.includes('id="main-menu"')) {
        // Si no hay nav con id main-menu, añadirlo después del botón
        htmlContent = htmlContent.replace(
          /<button class="menu-toggle".*?<\/button>/s,
          match => match + '\n    <nav id="main-menu" aria-label="Menú principal">\n      <ul>\n        <li><a href="' + getRelativePath(filePath, 'index.html') + '">Inicio</a></li>\n        <li><a href="' + getRelativePath(filePath, 'sobre-mi/sobre-mi.html') + '">Sobre mí</a></li>\n        <li><a href="' + getRelativePath(filePath, 'Proyectos/Proyectos.html') + '">Proyectos</a></li>\n        <li><a href="' + getRelativePath(filePath, 'Manuales/manuales.html') + '">Manuales técnicos</a></li>\n        <li><a href="' + getRelativePath(filePath, 'recursos/recursos.html') + '">Recursos</a></li>\n        <li><a href="' + getRelativePath(filePath, 'contacto/contacto.html') + '">Contacto</a></li>\n      </ul>\n    </nav>'
        );
        
        modified = true;
        console.log(`Nav del menú añadido en: ${filePath}`);
      }
      
      // Guardar el archivo modificado si hubo cambios
      if (modified) {
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Archivo guardado con modificaciones: ${filePath}`);
      } else {
        console.log(`No se requieren cambios en: ${filePath}`);
      }
    }
  });
}

// Función para generar rutas relativas entre archivos
function getRelativePath(fromPath, toPath) {
  const fromDir = path.dirname(fromPath);
  const relativePath = path.relative(fromDir, path.join(rootDir, toPath));
  return relativePath.replace(/\\/g, '/');
}

// Iniciar el proceso
try {
  console.log(`Procesando archivos HTML desde: ${rootDir}`);
  processDirectory(rootDir);
  console.log('Proceso completado con éxito');
} catch (error) {
  console.error(`Error al procesar los archivos: ${error.message}`);
}