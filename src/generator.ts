import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { parseZigFile } from "./parser.js";
import prettier from "prettier";

export async function generateBindings(libDir: string): Promise<void> {
    try {
        const modDir = path.join(libDir, "mod");
        await fs.ensureDir(modDir);

        const zigFiles = await glob(`${libDir}/zig/**/*.zig`);

        if (zigFiles.length === 0) {
            console.warn("⚠️ No Zig files found in zig directory.");
            return;
        }

        const exports: Record<string, string[]> = {};

        for (const zigFile of zigFiles) {
            const fileName = path.basename(zigFile, ".zig");
            const relativePath = path.relative(path.join(libDir, "zig"), zigFile);
            const relativeDir = path.dirname(relativePath);
            const targetDir = path.join(modDir, relativeDir);

            await fs.ensureDir(targetDir);

            let functions;
            try {
                functions = parseZigFile(zigFile);
            } catch (err) {
                console.error(`❌ Failed to parse ${zigFile}:\n`, err);
                continue;
            }

            if (!functions || functions.length === 0) {
                console.warn(`⚠️ No exported functions found in ${zigFile}`);
                continue;
            }

            const tsFilePath = path.join(targetDir, `${fileName}.ts`);
            const tsContent = generateTypeScriptBinding(fileName, functions);

            try {
                await fs.writeFile(tsFilePath, tsContent, "utf8");
            } catch (err) {
                console.error(`❌ Failed to write TypeScript binding to ${tsFilePath}:\n`, err);
                continue;
            }

            const modulePath = path
                .join(relativeDir === "." ? "" : relativeDir, fileName)
                .replace(/\\/g, "/");

            const importPath = `./mod/${modulePath}`;
            exports[importPath] = functions.map((fn) => fn.name);
        }

        await generateIndexFile(libDir, exports);

        console.log("✅ Zig bindings generated successfully.");
    } catch (err) {
        console.error("❌ Unexpected error during Zig bindings generation:\n", err);
    }
}

function generateTypeScriptBinding(
    fileName: string,
    functions: Array<{
        name: string;
        args: Array<{ type: string }>;
        returnType: string;
    }>
): string {
    const typeMapping: Record<string, string> = {
        u8: "u8", u16: "u16", u32: "u32", u64: "u64",
        i8: "i8", i16: "i16", i32: "i32", i64: "i64",
        f32: "f32", f64: "f64", bool: "bool",
        void: "void", char: "char", ptr: "ptr", cstring: "cstring",
    };

    const lines: string[] = [];

    lines.push(`import { dlopen, FFIType, suffix } from "bun:ffi";`);
    lines.push(`import path from "path";\n`);
    lines.push(`const binPath = path.join(path.join(process.cwd(), "lib"), "bin");\n`);

    lines.push(`const lib = dlopen(path.join(binPath, \`${fileName}.\${suffix}\`), {`);

    for (const fn of functions) {
        lines.push(`  ${fn.name}: {`);
        lines.push(`    args: [${fn.args
            .map((arg) => `FFIType.${typeMapping[arg.type] || "u64"}`)
            .join(", ")}],`);
        lines.push(`    returns: FFIType.${typeMapping[fn.returnType] || "u64"},`);
        lines.push(`  },`);
    }

    lines.push(`});\n`);

    for (const fn of functions) {
        lines.push(`export const ${fn.name} = lib.symbols.${fn.name};`);
    }

    return lines.join("\n");
}

async function generateIndexFile(
    libDir: string,
    exports: Record<string, string[]>
): Promise<void> {
    try {
        const indexPath = path.join(libDir, "index.ts");
        let existingContent = "";

        if (await fs.pathExists(indexPath)) {
            existingContent = await fs.readFile(indexPath, "utf8");
        }

        const newExports: string[] = [];

        for (const [modulePath] of Object.entries(exports)) {
            const exportLine = `export * from "${modulePath}";\n`;
            if (!existingContent.includes(exportLine)) {
                newExports.push(exportLine);
            }
        }

        const benchmarkFn = `
export function Benchmark<T>(label: string, fn: () => T): T {
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
}
`;

        if (!existingContent.includes("export function Benchmark")) {
            newExports.push(benchmarkFn);
        }

        const finalContent = existingContent + "\n" + newExports.join("");

        const formatted = await prettier.format(finalContent, {
            parser: "typescript",
            semi: true,
            singleQuote: false,
            tabWidth: 4,
            trailingComma: "es5",
            bracketSpacing: true,
        });

        await fs.writeFile(indexPath, formatted, "utf8");
    } catch (err) {
        console.error("❌ Failed to generate index.ts:\n", err);
    }
}
