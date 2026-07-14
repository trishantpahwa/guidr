# Contributing to guidr

First off, thank you for considering contributing to guidr! It's people like you that make guidr a great tour library for the Next.js/React community.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported.** Search the [issues list](https://github.com/trishantpahwa/guidr/issues).
- **Use the Bug Report template** and provide as much information as possible.
- **Provide a reproducible example.** A minimal repo, CodeSandbox, or StackBlitz link helps us fix the issue faster.

### Suggesting Features

- **Check if the feature has already been requested.**
- **Explain why the feature would be useful.**
- **Be as detailed as possible.**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled `good first issue` or `help wanted`. Our [automated setup](.github/workflows/issue-auto-respond.yml) will even assign it to you automatically if you comment on it!

1. **Fork the repository.**
2. **Clone your fork.**
3. **Create a new branch** for your fix or feature.
4. **Make your changes.**
5. **Verify your changes** (see below).
6. **Commit your changes.** We follow simple, descriptive commit messages.
7. **Push to your fork.**
8. **Submit a Pull Request.**

## Development Setup

```bash
# Clone the repository
git clone https://github.com/trishantpahwa/guidr.git
cd guidr

# Install dependencies
npm install

# Build the library
npm run build

# Watch mode while developing
npm run dev

# Typecheck
npm run typecheck

# Lint
npm run lint
```

### Trying your changes against the example app

The `example/` directory is a Next.js App Router app that consumes the library via a local `file:..` dependency — it's the fastest way to see your changes in a real browser.

```bash
npm run build          # build the library once
cd example
npm install
npm run dev             # http://localhost:3000
```

Re-run `npm run build` (or `npm run dev` in watch mode) at the repo root after each library change, and refresh the example app.

## Pull Request Process

1. Ensure `npm run typecheck`, `npm run lint`, and `npm run build` all pass locally.
2. Update the README.md with details of changes to the public API (new props, options, exports).
3. You may merge the Pull Request once you have the sign-off of a maintainer, or if you do not have permission to do that, request a maintainer to merge it for you.

## Need Help?

Feel free to open an issue or start a discussion — we're happy to help!
