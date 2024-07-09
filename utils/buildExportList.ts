import fs from 'fs'
import path from 'path'

import { URL, fileURLToPath } from 'url';
import { dirname } from 'path';

function getCurrentDirectory(filePath: string | URL){
const __filename = fileURLToPath(filePath);
return dirname(__filename)
}

function buildExportList(directory: string) {
    const files = fs.readdirSync(directory);
    const exportList:any = {}      
    
    files.forEach((route) => {

        // Exclude index file
        if(route !== 'index.js'){
            exportList[route.split('.')[0]] = path.join(directory, route)
        }
        
    });

    return exportList;
}

export {
    buildExportList,
    getCurrentDirectory
}