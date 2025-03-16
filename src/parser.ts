import fs from "fs";

interface FunctionArg {
    name: string;
    type: string;
}

interface FunctionSignature {
    name: string;
    args: FunctionArg[];
    returnType: string;
}

export function parseZigFile(filePath: string): FunctionSignature[] {
    const content = fs.readFileSync(filePath, "utf-8");
    const functions: FunctionSignature[] = [];

    // Regular expression to match Zig function declarations
    const fnRegex =
        /export\s+fn\s+(\w+)\s*\(([^)]*)\)\s+([\w*]+)\s*\{/g;

    let match;
    while ((match = fnRegex.exec(content)) !== null) {
        const name = match[1];
        const argsStr = match[2].trim();
        const returnType = match[3]?.trim();

        const args: FunctionArg[] = [];

        if (argsStr) {
            // Parse function arguments
            const argParts = argsStr.split(",");
            for (const argPart of argParts) {
                const [argName, argType] = argPart
                    .trim()
                    .split(":")
                    .map((s) => s.trim());
                args.push({ name: argName, type: argType });
            }
        }

        functions.push({ name, args, returnType });
    }

    return functions;
}
