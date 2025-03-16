# RustPort

RustPort is a command-line tool that automates the generation of TypeScript Foreign Function Interface (FFI) bindings for Rust libraries. It simplifies the process of calling Rust functions from JavaScript/TypeScript, making it an excellent choice for Bun-based projects that require high-performance Rust functions.

## Why RustPort?

- **Automated Rust FFI Binding Generation**: No need to manually write bindings; RustPort handles it for you.
- **Seamless Integration with Bun**: Works effortlessly with Bun's FFI capabilities.
- **Efficient Type Mapping**: Maps Rust types to TypeScript with minimal effort.
- **Simple CLI Interface**: Generate and clean bindings with a single command.

## Installation

RustPort can be installed globally using `npm`, `yarn`, or `bun`:

```bash
# Using npm
npm install -g rustport

# Using yarn
yarn global add rustport

# Using bun
bun add -g rustport
```

## Getting Started

To use RustPort, follow these steps:

### 1. Set Up Your Project

First, create a `lib/` directory in your project root. This directory will store the generated bindings and compiled Rust libraries.

Inside `lib/`, create an `rs/` subdirectory where you will place your Rust source files.

```bash
mkdir -p lib/rs
```

### 2. Write Your Rust Code

Inside `lib/rs/`, create a Rust source file, e.g., `hello.rs`, with the following content:

```rust
#[no_mangle]
pub extern "C" fn say_hello(name: *const u8) {
    println!("Hello, {}!", unsafe { std::ffi::CStr::from_ptr(name).to_str().unwrap() });
}
```

### 3. Generate Bindings

Now, let RustPort do its magic. Run:

```bash
rustport generate lib/
```

This will:
- Compile Rust files into dynamic libraries (`.so`/`.dll`/`.dylib` depending on the platform).
- Generate TypeScript FFI bindings.
- Create an `index.ts` file inside `lib/`.

### 4. Use Rust Functions in TypeScript

Once the bindings are generated, you can import and use the Rust functions in your JavaScript/TypeScript code:

```typescript
import { sayHello } from "./lib";

sayHello("World");
```

Yes, it’s that easy! Rust speed, Bun simplicity—what more do you need?

---

## CLI Commands

### `rustport generate <path>`
Generates Rust FFI bindings and compiles Rust files to dynamic libraries.

Example:
```bash
rustport generate lib/
```

### `rustport clean`
Removes generated files, including compiled Rust libraries and TypeScript bindings.

Example:
```bash
rustport clean
```

### `rustport help`
Displays the help menu with available commands.

Example:
```bash
rustport help
```

## Advanced Usage

### Customizing Bindings
The generated `index.ts` file can be modified to better suit your project’s needs. You can rename functions, add additional TypeScript types, or provide wrapper functions.

Example (after generating bindings):
```typescript
import { sayHello as rustSayHello } from "./lib";

export function sayHello(name: string) {
    rustSayHello(name);
}
```

### Passing and Returning Numbers
Rust functions can return numbers, making complex calculations super efficient.

#### Rust Code (`math.rs`):
```rust
#[no_mangle]
pub extern "C" fn add_numbers(a: i32, b: i32) -> i32 {
    a + b
}
```

Generate bindings:
```bash
rustport generate lib/
```

#### TypeScript Usage:
```typescript
import { addNumbers } from "./lib";

console.log("5 + 3 =", addNumbers(5, 3));
```

### Passing and Returning Strings
Rust can return strings too! But you need to manage memory properly.

#### Rust Code (`string_utils.rs`):
```rust
use std::ffi::{CString, CStr};
use std::os::raw::c_char;

#[no_mangle]
pub extern "C" fn greet(name: *const c_char) -> *mut c_char {
    let c_str = unsafe { CStr::from_ptr(name) };
    let r_str = format!("Hello, {}!", c_str.to_str().unwrap());
    CString::new(r_str).unwrap().into_raw()
}
```

Generate bindings:
```bash
rustport generate lib/
```

#### TypeScript Usage:
```typescript
import { greet } from "./lib";

console.log(greet("Alice"));
```

Yes, Rust just greeted Alice from TypeScript. Wild, isn’t it?

## Troubleshooting

**1. RustPort fails to generate bindings**
- Ensure that Rust and Cargo are installed.
- Check that the `lib/rs/` directory contains valid Rust files.
- Run `cargo build` inside `lib/rs/` to diagnose compilation issues.

**2. TypeScript FFI calls fail**
- Ensure that the Rust functions are properly exported using `#[no_mangle]`.
- Verify that the correct function signatures are used in TypeScript.

**3. Dynamic libraries are not loading**
- On Windows, ensure that `.dll` files are in the correct directory.
- On macOS, use `install_name_tool` to set the correct library paths.
- On Linux, check `LD_LIBRARY_PATH`.

## Example Project

Here's a simple Bun project using RustPort:

### Directory Structure
```
my-project/
├── lib/
│   ├── index.ts
│   ├── rs/
│   │   ├── hello.rs
│   │   ├── math.rs
│   │   ├── string_utils.rs
│   │   ├── Cargo.toml
├── src/
│   ├── main.ts
├── package.json
```

### `main.ts`
```typescript
import { sayHello, addNumbers, greet } from "../lib";

sayHello("RustPort User");
console.log(addNumbers(10, 20));
console.log(greet("Bob"));
```

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests on GitHub. If RustPort made your life easier, buy us a virtual coffee! ☕

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

