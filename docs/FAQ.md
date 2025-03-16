# Frequently Asked Questions (FAQ)

## General Questions

### What is RustPort?
RustPort is a command-line tool that automates the generation of TypeScript Foreign Function Interface (FFI) bindings for Rust libraries. It simplifies the process of calling Rust functions from JavaScript/TypeScript, particularly in Bun-based projects.

### Why should I use RustPort?
RustPort eliminates the manual work of writing FFI bindings between Rust and TypeScript. It's especially useful when you need high-performance Rust functions in your JavaScript/TypeScript projects while maintaining a clean development workflow.

### Which platforms does RustPort support?
RustPort works on Windows, macOS, and Linux. The generated bindings will produce platform-specific dynamic libraries (`.dll`, `.dylib`, or `.so` files).

## Installation

### How do I install RustPort?
You can install RustPort globally using npm, yarn, or bun:
