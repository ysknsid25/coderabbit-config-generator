# Contributing

Thanks for your interest in improving CodeRabbit Config Generator. This document covers the local setup, day-to-day workflow, and expectations for pull requests.

## Prerequisites

- **Node.js 22.x**
- **Git**, with submodule support (used to vendor the official example configs)

## Setup

This repo vendors [`coderabbitai/awesome-coderabbit`](https://github.com/coderabbitai/awesome-coderabbit) as a git submodule at `vendor/awesome-coderabbit`. Its `configs/` directory is the source for the "use an official example" picker on the Import page.

```bash
git clone --recurse-submodules <repo-url>
cd coderabbit-config-generator
npm ci
npm run dev
```

If you already cloned the repo without `--recurse-submodules`, initialize it separately:

```bash
git submodule update --init --recursive
```

`npm run dev` and `npm run build` both run `scripts/generate-examples.ts` first (via the `predev`/`prebuild` npm hooks), which scans `vendor/awesome-coderabbit/configs/` and regenerates `src/examples/generated/examples.generated.ts`. That generated file is gitignored — it is rebuilt on every dev server start and build, so it always reflects whatever commit the submodule is currently checked out at. `npm test`/`npm run test:coverage` regenerate it too (via `pretest`/`pretest:coverage`), since the Import page imports it directly.

If the submodule isn't initialized, `generate:examples` fails fast with a message telling you to run `git submodule update --init --recursive`.

You can also run the generation step manually:

```bash
npm run generate:examples
```

### Updating the vendored examples

To pull in newer official examples, update the submodule pointer and commit it:

```bash
git submodule update --remote vendor/awesome-coderabbit
git add vendor/awesome-coderabbit
git commit -m "chore: update awesome-coderabbit submodule"
```

Do not commit `src/examples/generated/` — it's generated on demand and is gitignored.

## Coding conventions

- Formatting and style are enforced by ESLint (`eslint.config.mjs`, `@stylistic/eslint-plugin`): 2-space indent, single quotes, semicolons. Run `npm run lint` (or `npm run lint:fix` to auto-fix) before committing.
- Comments are written in English only, and only when the *why* isn't obvious from the code itself (a non-obvious constraint, a workaround, a subtle invariant). Don't add comments that restate what the code already says.
- Follow the existing patterns in the codebase (see the [Architecture](README.md#architecture) and [Project Structure](README.md#project-structure) sections of the README) rather than introducing new abstractions.

## Testing

Unit and component tests use Vitest (jsdom) + Testing Library.

```bash
npm test                # run once
npm run test:coverage   # with coverage
```

Add tests alongside new components/modules (`Foo.tsx` → `Foo.test.tsx`), following the existing test files as examples.

## Before opening a pull request

Make sure the following all pass:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Keep pull requests focused on a single change, and describe the *why* behind the change in the description.
