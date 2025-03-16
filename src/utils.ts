import fs from "fs-extra";
import path from "path";

export function cleanGeneratedFiles(libDir: string): void {
    const modDir = path.join(libDir, "mod");
    const binDir = path.join(libDir, "bin");
    const indexFile = path.join(libDir, "index.ts");

    // Remove mod directory
    if (fs.existsSync(modDir)) {
        fs.removeSync(modDir);
    }

    // Remove bin directory
    if (fs.existsSync(binDir)) {
        fs.removeSync(binDir);
    }

    // Remove index.ts
    if (fs.existsSync(indexFile)) {
        fs.unlinkSync(indexFile);
    }
}
