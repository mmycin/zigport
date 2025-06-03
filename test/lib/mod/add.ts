import { dlopen, FFIType, suffix } from "bun:ffi";
import path from "path";

const binPath = path.join(path.join(process.cwd(), "lib"), "bin");

const lib = dlopen(path.join(binPath, `add.${suffix}`), {
  add: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.i32,
  },
});

export const add = lib.symbols.add;