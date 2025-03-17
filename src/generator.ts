import fs from "fs-extra";
import path from "path";
import { parseZigFile } from "./parser.js";
import { glob } from "glob";

export async function generateBindings(libDir: string): Promise<void> {
    // Create mod directory if it doesn't exist
    const modDir = path.join(libDir, "mod");
    await fs.ensureDir(modDir);

    // Get all Zig files
    const zigFiles = await glob(`${libDir}/zig/**/*.zig`);

    // Track all exports for index.ts
    const exports: Record<string, string[]> = {};

    // Process each Zig file
    for (const zigFile of zigFiles) {
        const fileName = path.basename(zigFile, ".zig");
        const relativePath = path.relative(path.join(libDir, "zig"), zigFile);
        const relativeDir = path.dirname(relativePath);

        // Create subdirectories in mod/ if needed
        const targetDir = path.join(modDir, relativeDir);
        await fs.ensureDir(targetDir);

        // Parse Zig file to extract function signatures
        const functions = parseZigFile(zigFile);

        if (functions.length === 0) {
            console.warn(`Warning: No exported functions found in ${zigFile}`);
            continue;
        }

        // Generate TypeScript binding file
        const tsFilePath = path.join(targetDir, `${fileName}.ts`);
        const tsContent = generateTypeScriptBinding(fileName, functions);
        await fs.writeFile(tsFilePath, tsContent, { encoding: 'utf8' });

        // Track exports for index.ts
        const modulePath = path
            .join(relativeDir === "." ? "" : relativeDir, fileName)
            .replace(/\\/g, "/");
        const importPath = `./${path.join("mod", modulePath).replace(/\\/g, "/")}`;

        exports[importPath] = functions.map((fn) => fn.name);
    }

    // Generate index.ts
    await generateIndexFile(libDir, exports);
}

function generateTypeScriptBinding(
    fileName: string,
    functions: Array<{
        name: string;
        args: Array<{ type: string }>;
        returnType: string;
    }>
): string {
    let content = `import { dlopen, FFIType, suffix } from "bun:ffi";
import path from "path";

const BASE_DIR = process.cwd();
const binPath = path.join(BASE_DIR, "/lib/bin");
`;

    // Map Zig types to FFI types
    const typeMapping: Record<string, string> = {
        u8: "u8",
        u16: "u16",
        u32: "u32",
        u64: "u64",
        i8: "i8",
        i16: "i16",
        i32: "i32",
        i64: "i64",
        f32: "f32",
        f64: "f64",
        bool: "bool",
        void: "void",
        char: "char",
        ptr: "ptr",
        cstring: "cstring",
    };

    // First create the FFI binding
    content += `const lib = dlopen(path.join(binPath, \`${fileName}.\${suffix}\`), {
`;

    // Generate the FFI function bindings
    for (const fn of functions) {
        content += `  ${fn.name}: {
    args: [${fn.args
        .map((arg) => `FFIType.${typeMapping[arg.type] || "u64"}`)
        .join(", ")}],
    returns: FFIType.${typeMapping[fn.returnType] || "u64"},
  },
`;
    }

    content += `});

`;

    // Then export each function individually
    for (const fn of functions) {
        content += `export const ${fn.name} = lib.symbols.${fn.name};
`;
    }

    return content;
}

async function generateIndexFile(
    libDir: string,
    exports: Record<string, string[]>
): Promise<void> {
    let content = "";

    // Generate imports with proper relative paths
    for (const [modulePath, functionNames] of Object.entries(exports)) {
        // Add export statement with the correct path
        content += `export * from "${modulePath}";
`;
    }

    content += "\n";

    // Write index.ts
    const indexFilePath = path.join(libDir, "index.ts");
    await fs.appendFile(indexFilePath, content, { encoding: "utf8" });
}
