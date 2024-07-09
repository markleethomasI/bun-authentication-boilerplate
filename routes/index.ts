import { Router } from "express"
import { buildExportList, getCurrentDirectory } from "../utils/buildExportList.js"

const currentDirectory = getCurrentDirectory(import.meta.url)

const exportList = buildExportList(currentDirectory)

const router = Router()

const buildRoutersImports = async () => {
    if (exportList) {

        const importedFunctions: any = {};

        for (const property in exportList) {
            const routeName: string = property;
            const filePath = exportList[property as keyof typeof exportList];
            const importedModule = await import(filePath);
            importedFunctions[routeName] = importedModule.default;
            router.use('/' + routeName, importedFunctions[routeName])
        }
    }
}

buildRoutersImports();

export default router
