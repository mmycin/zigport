# Zigport

`zigport` is an NPM package as well as a command-line tool that automates the generation of TypeScript Foreign Function Interface (FFI) bindings for **Zig** libraries created by Tahcin Ul Karim (Mycin). It simplifies the process of calling Zig functions from JavaScript/TypeScript, making it an excellent choice for **Bun**-based projects that require high-performance Zig functions. Yes, you can now summon Zig speed into your Bun app without breaking a sweat!
---

## Why zigport?

- **Automated Zig FFI Binding Generation**: No need to manually write bindings; `zigport` does the heavy lifting for you.
- **Seamless Integration with Bun**: Works like magic with Bun’s FFI capabilities.
- **Efficient Type Mapping**: Zig types get mapped to TypeScript with zero headaches.
- **Simple CLI Interface**: Generate and clean bindings with a single command. No over-engineered nonsense.

## Installation

You can install `zigport` globally using `npm`, `yarn`, or `bun`:

```bash
# Using npm
npm install -g zigport

# Using yarn
yarn global add zigport

# Using bun
bun add -g zigport
```

## Getting Started

### 1. Set Up Your Project

Create a `lib/` directory in your project root. This is where the magic happens.

```bash
mkdir -p lib/zig
```

### 2. Write Your Zig Code

Inside `lib/zig/`, create a Zig source file (e.g., `hello.zig`) with the following content:

```zig
const std = @import("std");

export fn say_hello() void {
    std.debug.print("Hello, {s}!\n", .{"World"});
}
```

### 3. Generate Bindings

Now, let `zigport` do its thing:

```bash
zigport generate lib/
```

This will:
- Compile Zig files into dynamic libraries (`.so`, `.dll`, `.dylib` depending on your platform).
- Generate TypeScript FFI bindings.
- Create an `index.ts` file inside `lib/`.

### 4. Use Zig Functions in TypeScript

Once the bindings are generated, import and use them in your TypeScript code:

```typescript
import { sayHello } from "./lib";

sayHello();
```

### 5. Run it!
Note that for now it only supports **Bun**, but we’re working on supporting Deno and Node.js. For this, you'll need Bun installed on your machine.
Install Bun using `npm`, `yarn`, or `bun`:  
```bash
npm install -g bun
```
Now run the file.

```bash
bun run fileName.ts
```

Boom. Zig-powered performance, Bun simplicity. Life’s good.

---

## CLI Commands

### `zigport generate <path>`
Generates Zig FFI bindings and compiles Zig files into dynamic libraries.

```bash
zigport generate lib/
```

### `zigport clean`
Removes generated files, including compiled Zig libraries and TypeScript bindings.

```bash
zigport clean
```

### `zigport help`
Displays the help menu with available commands.

```bash
zigport help
```

---

## Advanced Usage

### Passing and Returning Numbers

Zig can return numbers, making complex calculations lightning-fast.

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

Zig can return strings too! But memory management is your responsibility.

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

Zig just greeted Alice from TypeScript. Mind-blowing, right?

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

---

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

Love `zigport`? Want to make it even better? Feel free to open issues or submit pull requests on GitHub. If `zigport` saved you hours of headache, consider buying us a virtual coffee ☕️!

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Note: Also, check out [RustPort](https://github.com/mmycin/rustport) – a similar tool that generates TypeScript FFI bindings for Rust libraries. Because Rust needs love too!

