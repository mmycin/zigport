# zigport

`zigport` is a command-line tool that automates the generation of TypeScript Foreign Function Interface (FFI) bindings for **Zig** libraries. It simplifies the process of calling Zig functions from JavaScript/TypeScript, making it an excellent choice for **Bun**-based projects that require high-performance Zig functions.

## Why zigport?

- **Automated Zig FFI Binding Generation**: No need to manually write bindings; `zigport` handles it for you.
- **Seamless Integration with Bun**: Works effortlessly with Bun's FFI capabilities.
- **Efficient Type Mapping**: Maps Zig types to TypeScript with minimal effort.
- **Simple CLI Interface**: Generate and clean bindings with a single command.

## Installation

`zigport` can be installed globally using `npm`, `yarn`, or `bun`:

```bash
# Using npm
npm install -g zigport

# Using yarn
yarn global add zigport

# Using bun
bun add -g zigport
```

## Getting Started

To use `zigport`, follow these steps:

### 1. Set Up Your Project

Create a `lib/` directory in your project root. This directory will store the generated bindings and compiled Zig libraries.

Inside `lib/`, create an `zig/` subdirectory where you will place your Zig source files.

```bash
mkdir -p lib/zig
```

### 2. Write Your Zig Code

Inside `lib/zig/`, create a Zig source file (e.g., `hello.zig`) with the following content:

```zig
const std = @import("std");

export fn say_hello(name: [*]const u8) void {
    std.debug.print("Hello, {s}!\n", .{"World"});
}
```

### 3. Generate Bindings

Now, let `zigport` do its magic. Run:

```bash
zigport generate lib/
```

This will:
- Compile Zig files into dynamic libraries (`.so`, `.dll`, `.dylib` depending on your platform).
- Generate TypeScript FFI bindings.
- Create an `index.ts` file inside `lib/`.

### 4. Use Zig Functions in TypeScript

Once the bindings are generated, you can import and use the Zig functions in your JavaScript/TypeScript code:

```typescript
import { sayHello } from "./lib";

sayHello();
```

Yes, it’s that easy! Zig speed, Bun simplicity—what more do you need?

---

## CLI Commands

### `zigport generate <path>`
Generates Zig FFI bindings and compiles Zig files into dynamic libraries.

Example:
```bash
zigport generate lib/
```

### `zigport clean`
Removes generated files, including compiled Zig libraries and TypeScript bindings.

Example:
```bash
zigport clean
```

### `zigport help`
Displays the help menu with available commands.

Example:
```bash
zigport help
```

## Advanced Usage

### Customizing Bindings
The generated `index.ts` file can be modified to better suit your project’s needs. You can rename functions, add additional TypeScript types, or provide wrapper functions.

Example (after generating bindings):

```typescript
import { sayHello as zigSayHello } from "./lib";

export function sayHello(name: string) {
    zigSayHello(name);
}
```

### Passing and Returning Numbers
Zig functions can return numbers, making complex calculations super efficient.

#### Zig Code (`math.zig`):

```zig
export fn add_numbers(a: i32, b: i32) i32 {
    return a + b;
}
```

Generate bindings:

```bash
zigport generate lib/
```

#### TypeScript Usage:

```typescript
import { addNumbers } from "./lib";

console.log("5 + 3 =", addNumbers(5, 3));
```

### Passing and Returning Strings
Zig can return strings too! But you need to manage memory properly.

#### Zig Code (`string_utils.zig`):

```zig
const std = @import("std");

export fn greet(name: [*]const u8) [*]const u8 {
    const message = "Hello, " ++ name ++ "!";
    return message;
}
```

Generate bindings:

```bash
zigport generate lib/
```

#### TypeScript Usage:

```typescript
import { greet } from "./lib";

console.log(greet("Alice"));
```

Yes, Zig just greeted Alice from TypeScript. Wild, isn’t it?

---

## Troubleshooting

### 1. `zigport` fails to generate bindings
- Ensure that **Zig** is installed.
- Check that the `lib/zig/` directory contains valid Zig files.
- Run `zig build` inside `lib/zig/` to diagnose compilation issues.

### 2. TypeScript FFI calls fail
- Ensure that the Zig functions are properly exported using `export`.
- Verify that the correct function signatures are used in TypeScript.

### 3. Dynamic libraries are not loading
- On **Windows**, ensure that `.dll` files are in the correct directory.
- On **macOS**, use `install_name_tool` to set the correct library paths.
- On **Linux**, check `LD_LIBRARY_PATH`.

## Example Project

Here’s a simple Bun project using `zigport`:

### Directory Structure
```
my-project/
├── lib/
│   ├── zig/
│   │   ├── hello.zig
│   │   ├── math.zig
│   │   ├── string_utils.zig
│   │   ├── build.zig
├── src/
│   ├── main.ts
├── package.json
```

### `main.ts`

```typescript
import { sayHello, addNumbers, greet } from "../lib";

sayHello("zigport User");
console.log(addNumbers(10, 20));
console.log(greet("Bob"));
```

---

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests on GitHub. If `zigport` made your life easier, buy us a virtual coffee! ☕️

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---