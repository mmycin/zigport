import { Command } from "commander";
import chalk from "chalk";
import { generateBindings } from "./generator.js";
import { cleanGeneratedFiles } from "./utils.js";
import fs from "fs-extra";
import path from "path";

export function cli(args: string[]) {
    const program = new Command();

    program
        .name("zigport")
        .description(
            "Generate TypeScript FFI bindings for Zig libraries using Bun. Created by Mycin"
        )
        .version("1.0.1");

    program
        .command("generate")
        .description("Generate TypeScript bindings for Zig files")
        .argument(
            "<dir>",
            "Directory containing Zig files (should have a zig/ subdirectory)"
        )
        .action(async (dir: string) => {
            try {
                const libDir = path.resolve(process.cwd(), dir);

                // Check if the directory exists
                if (!fs.existsSync(libDir)) {
                    console.error(
                        chalk.red(`Error: Directory ${libDir} does not exist`)
                    );
                    process.exit(1);
                }

                // Check if zig/ subdirectory exists
                const zigDir = path.join(libDir, "zig");
                if (!fs.existsSync(zigDir)) {
                    console.error(
                        chalk.red(
                            `Error: ${zigDir} directory not found. Make sure your Zig files are in the zig/ subdirectory.`
                        )
                    );
                    process.exit(1);
                }

                console.log(
                    chalk.blue(`Generating bindings for Zig files in ${zigDir}...`)
                );

                // Compile Zig files
                await compileZigFiles(libDir);

                // Generate TypeScript bindings
                await generateBindings(libDir);

                console.log(
                    chalk.green("✓ Successfully generated TypeScript bindings!")
                );
                console.log(
                    chalk.blue(
                        `You can now import your Zig functions in your TypeScript code using the following import statement:`
                    )
                );

                console.log(
                    chalk.cyan("\nimport") +
                        " " + // Cyan for keywords
                        chalk.yellow("{") +
                        " " + // Yellow for `{`
                        chalk.blue("FUNCTIONNAME") +
                        " " + // Bright blue function
                        chalk.yellow("}") +
                        " " + // Yellow for `}`
                        chalk.cyan("from") +
                        " " + // Cyan for keywords
                        chalk.magenta('"./lib";\n') // Magenta for string
                );

            } catch (error) {
                console.error(
                    chalk.red(
                        `Error generating bindings: ${
                            error instanceof Error
                                ? error.message
                                : String(error)
                        }`
                    )
                );
                process.exit(1);
            }
        });

    program
        .command("clean")
        .description(
            "Remove generated files (mod/ and bin/ directories and index.ts)"
        )
        .argument("[dir]", "Directory to clean (defaults to lib/)", "lib")
        .action((dir: string) => {
            try {
                const libDir = path.resolve(process.cwd(), dir);
                cleanGeneratedFiles(libDir);
                console.log(
                    chalk.green(
                        `✓ Successfully cleaned generated files in ${libDir}`
                    )
                );
            } catch (error) {
                console.error(
                    chalk.red(
                        `Error cleaning files: ${
                            error instanceof Error
                                ? error.message
                                : String(error)
                        }`
                    )
                );
                process.exit(1);
            }
        });

    program.parse(args);
}

async function compileZigFiles(libDir: string): Promise<void> {
    const { execSync } = await import("child_process");

    const platform = process.platform == "win32" ? "windows" : "linux";
    // Create build script content
    const buildScript = `
#!/bin/bash

LIBS_DIR="${libDir}"
BIN_DIR="$LIBS_DIR/bin"

mkdir -p "$BIN_DIR"

# Compile Zig files to dynamic libraries (DLLs)
for file in "$LIBS_DIR"/zig/*.zig; do
    [ -e "$file" ] || continue  # Skip if no .zig files exist
    output_name="\${file%.zig}.dll"  # Change extension to .dll
    zig build-lib -dynamic "$file" -target x86_64-${platform}
done

# Clean up unnecessary files
find "./" -type f \\( -name "*.dll.a" -o -name "*.dll.obj" -o -name "*.lib" -o -name "*.pdb" \\) -delete

# Move all .dll files to libs/bin/
find "./" -type f -name "*.dll" -exec mv {} "$BIN_DIR" \\;

echo "Compilation and cleanup completed successfully!"
`;

    // Write temporary build script
    const tempScriptPath = path.join(process.cwd(), "zigport-temp-build.sh");
    fs.writeFileSync(tempScriptPath, buildScript, { mode: 0o755 });

    try {
        // Execute build script
        execSync(`bash ${tempScriptPath}`, { stdio: "inherit" });
    } finally {
        // Clean up temporary script
        fs.unlinkSync(tempScriptPath);
    }
}