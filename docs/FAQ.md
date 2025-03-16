# Frequently Asked Questions (FAQ)

## General Questions

### What is zigport?
`zigport` is a command-line tool that automates the generation of TypeScript Foreign Function Interface (FFI) bindings for **Zig** libraries. It simplifies the process of calling Zig functions from JavaScript/TypeScript, particularly in **Bun-based** projects.

### Why should I use zigport?
`zigport` eliminates the manual work of writing FFI bindings between Zig and TypeScript. It's especially useful when you need high-performance Zig functions in your JavaScript/TypeScript projects while maintaining a clean development workflow.

### Which platforms does zigport support?
`zigport` works on **Windows**, **macOS**, and **Linux**. The generated bindings will produce platform-specific dynamic libraries (`.dll`, `.dylib`, or `.so` files).

## Installation

### How do I install zigport?
You can install `zigport` globally using `npm`, `yarn`, or `bun`:

```bash
# Using npm
npm install -g zigport

# Using yarn
yarn global add zigport

# Using bun
bun add -g zigport
```

### Do I need to have Zig installed?
Yes, you will need **Zig** installed on your system to compile the Zig source files. You can download Zig from the [official Zig website](https://ziglang.org/download/).

### Does zigport require any additional dependencies?
No, `zigport` only depends on **Zig** itself to generate the bindings. However, make sure that your environment is properly set up to work with Zig libraries.

---