// plugins/ScriptCraft/plugins/CombineTexturePacks.js

var fs = require('fs');
var path = require('path');

var sourcePack1 = 'plugins/ScriptCraft/plugins/textures/pack1'; // Ruta al primer texture pack
var sourcePack2 = 'plugins/ScriptCraft/plugins/textures/pack2'; // Ruta al segundo texture pack
var combinedPack = 'plugins/ScriptCraft/plugins/textures/combined'; // Ruta donde se guardará el texture pack combinado

function combineTexturePacks() {
    try {
        console.log('Iniciando combinación de texture packs...');

        // Verificar si las carpetas de los texture packs existen
        if (!fs.existsSync(sourcePack1) || !fs.existsSync(sourcePack2)) {
            console.error('Error: Las carpetas de los texture packs no existen.');
            return;
        }

        // Crear la carpeta donde se guardará el texture pack combinado si no existe
        if (!fs.existsSync(combinedPack)) {
            fs.mkdirSync(combinedPack, { recursive: true });
        }

        // Copiar archivos del primer texture pack al texture pack combinado
        copyFiles(sourcePack1, combinedPack);

        // Copiar archivos del segundo texture pack al texture pack combinado (sobrescribir si es necesario)
        copyFiles(sourcePack2, combinedPack, true);

        console.log('Texture packs combinados exitosamente en: ' + combinedPack);
    } catch (error) {
        console.error('Error al combinar texture packs:', error);
    }
}

function copyFiles(sourceDir, destDir, overwrite = false) {
    var files = fs.readdirSync(sourceDir);
    files.forEach(function(file) {
        var srcPath = path.join(sourceDir, file);
        var destPath = path.join(destDir, file);

        var stats = fs.statSync(srcPath);
        if (stats.isDirectory()) {
            // Si es un directorio, crearlo en el texture pack combinado y copiar sus contenidos
            var subDestDir = path.join(destDir, file);
            if (!fs.existsSync(subDestDir)) {
                fs.mkdirSync(subDestDir, { recursive: true });
            }
            copyFiles(srcPath, subDestDir, overwrite);
        } else {
            // Si es un archivo, copiarlo al texture pack combinado
            // Si el archivo existe y no se permite sobrescribir, salta este archivo
            if (fs.existsSync(destPath) && !overwrite) {
                console.log('El archivo ' + file + ' ya existe en ' + destDir + '. Saltando.');
                return;
            }
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Ejecutar la función al iniciar ScriptCraft
combineTexturePacks();

